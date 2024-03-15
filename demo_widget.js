(function () {
  // Localize jQuery variable
  var jQuery;

  /******** Load jQuery if not present *********/
  if (
    window.jQuery === undefined ||
    window.jQuery.fn.jquery !== "1.4.2"
  ) {
    var script_tag = document.createElement("script");
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute(
      "src",
      "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"
    );
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        // For old versions of IE
        if (
          this.readyState == "complete" ||
          this.readyState == "loaded"
        ) {
          scriptLoadHandler();
        }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (
      document.getElementsByTagName("head")[0] || document.documentElement
    ).appendChild(script_tag);
  } else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
  }

  function realtimeUpdate() {
    const labelPrice = document.getElementById("label-price");
    window.socket = new WebSocket(
      "wss://ws.coincap.io/prices?assets=" + "ethereum"
    );
    window.socket.addEventListener("message", function (a) {
      tradeMsg = JSON.parse(a.data);
      console.log("coincap_etherium_price", tradeMsg);
      labelPrice.innerHTML = `$${new Intl.NumberFormat().format(
        tradeMsg.ethereum
      )}`;
    });
  }

  /******** Called once jQuery has loaded ******/
  function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
  }

  /******** Our main function ********/
  function main() {
    jQuery(document).ready(function ($) {
      /******* Load CSS *******/
      var css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://temp.staticsave.com/65f3eeab5ac62.css",
      });
      css_link.appendTo("head");

      /******* Load HTML *******/
      var jsonp_url =
        "https://nextjs-dashboard-sigma-ten-45.vercel.app/widget.json";
      $.getJSON(jsonp_url, function (data) {
        const html = data[1];
        $("#example-widget-container").html(
          "This data comes from another server: " + html
        );
        realtimeUpdate();
      });
    });
  }
})(); // We call our anonymous function immediately