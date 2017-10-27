<%@page import="java.util.*,java.io.File,java.io.FileOutputStream,org.apache.commons.fileupload.FileUpload,org.apache.commons.fileupload.FileItem,org.apache.commons.fileupload.disk.DiskFileItemFactory,org.apache.commons.fileupload.servlet.ServletFileUpload,sun.misc.BASE64Decoder"%>
<%@page contentType="application/json; charset=utf-8" %>
<%@page language="java" %>
<%
	String strJson = "{\"success\":false}";

	try{

		// get more info from: http://commons.apache.org/proper/commons-fileupload/

		DiskFileItemFactory factory = new DiskFileItemFactory();

		ServletContext servletContext = this.getServletConfig().getServletContext();
		File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);

		ServletFileUpload upload = new ServletFileUpload(factory);

		List<FileItem> items = upload.parseRequest(request);
		Iterator<FileItem> iter = items.iterator();

	    String fileName = null;
	    String tempFileName = null;
	    String contentType = null;
	    FileItem fileItem = null;

		while (iter.hasNext()) {
		    FileItem item = iter.next();
		    String fieldName = item.getFieldName();

		    if(fieldName.equals("fileName")){
		    	fileName = item.getString();
			}else if(fieldName.equals("RemoteFile")){
				tempFileName = item.getName();
				contentType = item.getContentType();
				fileItem = item;
			}
		}

		if(fileName == null || fileName.isEmpty()){
			fileName = tempFileName;
		}
		String path = application.getRealPath(request.getServletPath());
		String dir = new java.io.File(path).getParent();
	    String filePath = dir + "/UploadedImages/";

		File file = new File(filePath + fileName);
		
        if (file.exists())
        {
            int iniNum = 0;
            if (fileName.contains("(") && fileName.contains(")"))
            {
                int leftPhPos = fileName.lastIndexOf("(");
                int rightPhPos = fileName.lastIndexOf(")");
                if (leftPhPos < rightPhPos) {
                    String numStr = fileName.substring(leftPhPos + 1, rightPhPos);
                    try{
                    	iniNum = Integer.parseInt(numStr);
                    	fileName = fileName.substring(0, leftPhPos) + fileName.substring(rightPhPos + 1);
                    }catch(Exception ex){
                    	iniNum = 0;
                    }finally{}
                }
            }
            int indexPoint = fileName.lastIndexOf(".");
            String str1 = fileName.substring(0, indexPoint) + "(";
            String str2 = ")" + fileName.substring(indexPoint);
            for (int i = iniNum; ; ++i)
            {
            	file = new File(filePath + (str1 + i + str2));
                if (!file.exists())
                {
                    fileName = str1 + i + str2;
                    break;
                }
            }
        }

	    String fileFullPath = filePath + fileName;

    	file = new File(fileFullPath);

    	if(!file.getParentFile().exists()){
    		file.getParentFile().mkdir();
    	}
    	if(!file.exists()){
    		file.createNewFile();
    	}
		if(!contentType.contains("text/plain")){
			fileItem.write(file);
		}else{
			String base64Str = fileItem.getString();
			byte[] b = null;
			b = (new BASE64Decoder()).decodeBuffer(base64Str);
			FileOutputStream fileOutStream = new FileOutputStream(file);
			fileOutStream.write(b);
			fileOutStream.flush();
			fileOutStream.close();
		}

		strJson = "{\"success\":true, \"fileName\":\"" + fileName + "\"}";
	}
	catch(Exception ex){
		strJson = "{\"success\":false, \"error\": \"" + ex.getMessage().replace("\\", "\\\\") + "\"}";
	}

    out.clear();
    out.write(strJson);
    out.close();
%>