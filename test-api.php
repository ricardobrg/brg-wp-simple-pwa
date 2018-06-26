<?php
//prevent browser caching... it would make us think service-worker is caching when it's not...
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
//show the date
echo date("H:i:s"); 
