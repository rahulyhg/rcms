<?php
	
class Image
{
	public static function SaveImageWithThumb($dir, $filename, $image){
		
		// create thumb
		$thumb = Image::ResizeWithCenterCrop($image, $dir, 't-'.$filename, 200, 200); 
		
		// create original (but limit to 1024x768)
		$original = Image::Resize($image, $dir, $filename, 1024, 768); 
		
		$size = ($thumb + $original)/1024; // get combined size
		
		return $size;
	}
	
	public static function Resize($file, $dir, $filename, $max_width, $max_height){
		
		list($src_width, $src_height, $type, $attr) = getimagesize($file);
		
		$ext = 'jpg';
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $ext = 'jpg'; break; 
			case IMAGETYPE_PNG: $ext = 'png'; break; 
			case IMAGETYPE_GIF: $ext = 'gif'; break; 
			default: return false; 
		}
		
		if($src_width > $max_width){ 
			$target_w = $max_width; 
			$target_h = $src_height * $max_width / $src_width; 
		} 
		else if($src_height > $max_height){
			$target_w = $src_width * $max_height / $src_height; 
			$target_h = $src_height; 
		}
		else{ 
			$target_w = $src_width; 
			$target_h = $src_height;
		}
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $n_img = imagecreatefromjpeg($file); break; 
			case IMAGETYPE_PNG: $n_img = imagecreatefrompng($file); break; 
			case IMAGETYPE_GIF: $n_img = imagecreatefromgif($file); break; 
			default: return false; 
		}
		
		$dst_img = ImageCreateTrueColor($target_w, $target_h); 
		
		switch($type){ // fix for transparency issues
			case IMAGETYPE_PNG: 
				imagealphablending($dst_img, true);
		        imagesavealpha($dst_img, true);
		        $transparent_color = imagecolorallocatealpha($dst_img, 0, 0, 0, 127);
		        imagefill($dst_img, 0, 0, $transparent_color);
				break; 
			case IMAGETYPE_GIF: 
				$transparency_index = imagecolortransparent($dst_img);
		        if ($transparency_index >= 0) {
		            $transparent_color = imagecolorsforindex($dst_img, $transparency_index);
		            $transparency_index = imagecolorallocate($dst_img, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
		            imagefill($dst_img, 0, 0, $transparency_index);
		            imagecolortransparent($dst_img, $transparency_index);
		        }
				break; 
			default: break;
		}
		
		imagecopyresampled($dst_img, $n_img, 0, 0, 0, 0, $target_w, $target_h, $src_width, $src_height); 
		
		//die('size='.$size);
		
		//return $dst_img;
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		switch($ext){ 
			case 'jpg':{
				imagejpeg($dst_img, $full, 100);
				$size = filesize($full);
				break;
			}
			case 'png':{
				imagepng($dst_img, $full);
				$size = filesize($full);
				break;
			}
			case 'gif':{
				imagegif($dst_img, $full);
				$size = filesize($full);
				break;
			}
			default: return 0; 
		}
		
		return $size;
		
	}
	
	public static function ResizeWithCrop($file, $dir, $filename, $x_start, $y_start, $scale, $target_w, $target_h){
		
		list($src_w, $src_h, $type, $attr) = getimagesize($file);
		
		$new_w = ceil($src_w * $scale);
		$new_h = ceil($src_h * $scale);
		
		$x_start = $x_start * (1/$scale);
		$y_start = $y_start * (1/$scale);
		
		$ext = 'jpg';
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $ext = 'jpg'; break; 
			case IMAGETYPE_PNG: $ext = 'png'; break; 
			case IMAGETYPE_GIF: $ext = 'gif'; break; 
			default: return false; 
		}
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $n_img = imagecreatefromjpeg($file); break; 
			case IMAGETYPE_PNG: $n_img = imagecreatefrompng($file); break; 
			case IMAGETYPE_GIF: $n_img = imagecreatefromgif($file); break; 
			default: return false; 
		}
		
		$dst_img = ImageCreateTrueColor($target_w, $target_h); 
		
		switch($type){ // fix for transparency issues
			case IMAGETYPE_PNG: 
				imagealphablending($dst_img, true);
		        imagesavealpha($dst_img, true);
		        $transparent_color = imagecolorallocatealpha($dst_img, 0, 0, 0, 127);
		        imagefill($dst_img, 0, 0, $transparent_color);
				break; 
			case IMAGETYPE_GIF: 
				$transparency_index = imagecolortransparent($dst_img);
		        if ($transparency_index >= 0) {
		            $transparent_color = imagecolorsforindex($dst_img, $transparency_index);
		            $transparency_index = imagecolorallocate($dst_img, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
		            imagefill($dst_img, 0, 0, $transparency_index);
		            imagecolortransparent($dst_img, $transparency_index);
		        }
				break; 
			default: break;
		}
		
		imagecopyresampled($dst_img, $n_img, 0, 0, $x_start, $y_start, $new_w, $new_h, $src_w, $src_h);
		
		//return $dst_img;
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		switch($ext){ 
			case 'jpg':{
				imagejpeg($dst_img, $full, 100);
				$size = filesize($full);
				break;
			}
			case 'png':{
				imagepng($dst_img, $full);
				$size = filesize($full);
				break;
			}
			case 'gif':{
				imagegif($dst_img, $full);
				$size = filesize($full);
				break;
			}
			default: return 0; 
			
			return $size;	
		}
		
	}
	
	// Resizes and crops the picture from the center
	public static function ResizeWithCenterCrop($image, $dir, $filename, $target_w, $target_h){
		
		list($curr_w, $curr_h, $type, $attr) = getimagesize($image);
		
		$ext = 'jpg';
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $ext = 'jpg'; break; 
			case IMAGETYPE_PNG: $ext = 'png'; break; 
			case IMAGETYPE_GIF: $ext = 'gif'; break; 
			default: return false; 
		}
	
		$scale_h = $target_h/$curr_h;
		$scale_w = $target_w/$curr_w;
		
		$factor_x = ($curr_w/$target_w);
		$factor_y = ($curr_h/$target_h);
		
		if($factor_x>$factor_y){
			$factor = $factor_y;
		}
		else{
			$factor = $factor_x;
		}
	
		$up_w = ceil($target_w * $factor);
		$up_h = ceil($target_h * $factor);
		
		$x_start = ceil(($curr_w-$up_w)/2);
		$y_start = ceil(($curr_h-$up_h)/2);
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $n_img = imagecreatefromjpeg($image); break; 
			case IMAGETYPE_PNG: $n_img = imagecreatefrompng($image); break; 
			case IMAGETYPE_GIF: $n_img = imagecreatefromgif($image); break; 
			default: return false; 
		}
	
		$dst_img = ImageCreateTrueColor($target_w, $target_h);

		switch($type){ // fix for transparency issues
			case IMAGETYPE_PNG: 
				imagealphablending($dst_img, true);
		        imagesavealpha($dst_img, true);
		        $transparent_color = imagecolorallocatealpha($dst_img, 0, 0, 0, 127);
		        imagefill($dst_img, 0, 0, $transparent_color);
				break; 
			case IMAGETYPE_GIF: 
				$transparency_index = imagecolortransparent($dst_img);
		        if ($transparency_index >= 0) {
		            $transparent_color = imagecolorsforindex($dst_img, $transparency_index);
		            $transparency_index = imagecolorallocate($dst_img, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
		            imagefill($dst_img, 0, 0, $transparency_index);
		            imagecolortransparent($dst_img, $transparency_index);
		        }
				
				break; 
			default: break;
		}
		
		// (for testing) die('curr_w='.$curr_w.' curr_h='.$curr_h.' x_start='.$x_start.' y_start='.$y_start.' target_w='.$target_w.' target_h='.$target_h.' up_w='.$up_w.' up_h='.$up_h);
		
		imagecopyresampled($dst_img, $n_img, 0, 0, $x_start, $y_start, $target_w, $target_h, $up_w, $up_h); 
		
		//return $dst_img;
		$full = $dir.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		switch($ext){ 
			case 'jpg':{
				imagejpeg($dst_img, $full, 100);
				$size = filesize($full);
				return $size;
				break;
			}
			case 'png':{
				imagepng($dst_img, $full);
				$size = filesize($full);
				return $size;
				break;
			}
			case 'gif':{
				imagegif($dst_img, $full);
				$size = filesize($full);
				return $size;
				break;
			}
			default: return 0; 
		}
	
	}
}
	
?>