<!--[if lt IE 9]>
<script src="<?php print $scriptloc; ?>html5.js"></script>
<![endif]-->

<?php if($site->FacebookAppId!=''){ ?>
<meta property="fb:app_id" content="<?php print $site->FacebookAppId; ?>" />  
<?php } ?>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>bootstrap.min.js"></script>
<script type="text/javascript">var root = '<?php print $rootloc; ?>';</script>
<script type="text/javascript">var siteroot = '<?php print $dataloc; ?>';</script>
<script type="text/javascript" src="https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>jquery.respondMap-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>jquery.respondForm-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>jquery.respondList-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>messages.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>global.js"></script>
<script type="text/javascript" src="<?php print $scriptloc; ?>prettify.js"></script>

