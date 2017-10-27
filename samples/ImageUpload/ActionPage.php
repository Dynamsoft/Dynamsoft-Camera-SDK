<?php
	$strJson = "{\"success\":false}";
	
	try{

		$file = $_FILES["RemoteFile"];
		
		$fileName = $_POST["fileName"];
		if ($fileName == "" || $fileName == null) $fileName = $file["name"];
		$filePath = dirname(__FILE__) . "\\UploadedImages\\";

        if (file_exists($filePath . $fileName))
        {
            $iniNum = 0;
            if (strpos($fileName, "(") !== FALSE && strpos($fileName, ")") !== FALSE)
            {
                $leftPhPos =  strrpos($fileName, "(");
                $rightPhPos = strrpos($fileName, ")");
                if ($leftPhPos < $rightPhPos) {
                    $numStr = substr($fileName, $leftPhPos + 1, $rightPhPos - $leftPhPos - 1);
                    if (is_numeric($numStr))
                    {
                    	$iniNum = intval($numStr);
                        $fileName = substr($fileName, 0, $leftPhPos) . substr($fileName, $rightPhPos + 1);
                    }
                    else { 
                        $iniNum = 0;
                    }
                }
            }
            $indexPoint = strrpos($fileName, ".");
            $str1 = substr($fileName, 0, $indexPoint) . "(";
            $str2 = ")" . substr($fileName, $indexPoint);
            for ($i = $iniNum; ; ++$i)
            {
                if (!file_exists($filePath . ($str1 . $i . $str2)))
                {
                    $fileName = $str1 . $i . $str2;
                    break;
                }
            }
        }

		$fileFullPath = $filePath . $fileName;

		if(strpos($file["type"], 'text/plain') === false){
			move_uploaded_file($file["tmp_name"] , $fileFullPath);
		}else{
		    $file_contents = base64_decode(str_replace(' ', '+', file_get_contents($file['tmp_name'])));
		    file_put_contents($fileFullPath, $file_contents);
		}

		$strJson = "{\"success\":true, \"fileName\":\"" . $fileName . "\"}";
		

	}
	catch(Exception $ex){
		$strJson = "{\"success\":false, \"error\": \"" . ex.Message.Replace("\\", "\\\\") . "\"}";
	}	

    // Response.Clear();
    header("Content-Type: application/json; charset=utf-8");
    echo $strJson;
?>
