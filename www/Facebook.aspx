<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
      <meta name="viewport" content="width=480,user-scalable=0" />
   <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    -->
    <!--    <meta name="apple-mobile-web-app-capable" content="yes" />-->
    <!--    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="apple-touch-icon" href="icon.png">-->
    <title>Frog Log</title>
   
     <script src="jquery-1.9.1.js"></script>
  <script src="jquery-ui.js"></script>
   <script src="froglog.js" type="text/javascript"></script>
      <script src="jquery.ui.touch-punch.min.js"></script>
     <!-- <script src="TouchClick.js"></script>-->
    <!--to remove gray bok delay on mobiles https://github.com/ftlabs/fastclick-->
  <meta name="msapplication-tap-highlight" content="no">
    <style>
        * {
            -ms-user-select: none; 
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        html, body {   
            xwidth: 480px;
            xheight:700px;
        }
        body, div
        {
            margin: 0 0 0 0;
            padding: 0 0 0 0;
        }
        body
        {
            background-color: #A5CBFF;
             -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;

   /*
     Introduced in IE 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
   -ms-user-select: none;
   user-select: none;
        }
        #msgModelWindow
        {
            width: 480px;
            height:700px;
            background-image: url(overlay.png);
            position: absolute;
            text-align: center;
        }
        #msgModelWindowInner
        {
            border-radius: 6px;
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            background-color: White;
            margin: 100px auto 3px auto;
            padding: 10px 20px 0px 20px;
            width: 200px;
            border: 1px solid black;
        }
        #msgModelWindowInner h1, h2, h3, h4
        {
            text-shadow: 1px 1px 2px #333;
        }
        #wraper
        {
            width: 480px;
            height:700px;
            xmargin: 0px auto;
            padding: 0 0 0 0;
        }
        #gameCanvas
        {
            xwidth: 100%;
            xheight:100%;
            position: absolute;
            xborder: 1px solid black;
        }
        #dragicons
        {
             xwidth: 480px;
            xheight: 50px;
            position: absolute;
        }
        #dragicons canvas
        {
            cursor: pointer;
            -ms-touch-action: none;
        }
         #btnSound 
        {
           right:0px; 
           position: absolute;
            height: 25px;
             width: 25px;
        }
            a, input, div {
             -ms-touch-action: none !important;
         }
    </style>
     <script type="text/javascript">

         function resize() {
             //canvas = document.getElementById("gameCanvas");
             //// Our canvas must cover full height of screen
             //// regardless of the resolution
             //var height = window.innerHeight;

             //// So we need to calculate the proper scaled width
             //// that should work well with every resolution
             //var ratio = canvas.width / canvas.height;
             //var width = height * ratio;

             //canvas.style.width = width + 'px';
             //canvas.style.height = height + 'px';
         }

    </script>
</head>
<body onresize="resize()">
    
    <!--<div data-win-control="WinJS.UI.ViewBox">-->
  <div id="wraper" >   
           
         <canvas id="gameCanvas"  width="480" height="700" ></canvas>
   
          <div id="dragicons">
        </div>
      <div id="msgModelWindow">
            <div id="msgModelWindowInner">
                <div id="msgModelMessage">
                    <h1>
                        Loading......</h1>
                </div>
            </div>
        </div>  
           <img id="btnSound" src="images/Volume.png"  />

        </div>  
<!--    </div>-->
   
</body>
</html>
