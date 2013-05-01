$(document).ready(function($) {
  
$("#zip-field").keydown(function(e){
    if (e.keyCode == 13) {
    
      var $zip = $("#zip"),
      value = $zip.val();

    e.preventDefault();
    if (value) {
      $.ajax({
        url: "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + $zip.val() + ".json",
        dataType: "jsonp",
        success: function(data) {

          var mark = data.current_observation,
            location = mark.display_location,
            image = mark.image,
            $row = $("<tr></tr>"),
            $output = $("#output");

          $(".alert").fadeOut("slow");
          $row.append($("<td />", {
            html: "<img src='" + mark.icon_url + "' /></td>"
          }));
          $row.append($("<td />", {text: location.city}));
          $row.append($("<td />", {text: location.state_name}));
          $row.append($("<td />", {text: location.zip}));
          $row.append($("<td />", {text: mark.temp_f + "°F"}));
          
          //Deletes Row of Data
          $row.append($("<td />", {
            html: '<a href="#"><i class="icon-trash"></i></a>'
          })).on("click", function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
            if (!$output.find("tbody tr").length) {
              $output.fadeOut("slow");
            }
          });

          $output.find("tbody").append($row);
          $output.fadeIn("show");
          $("#zip").val("");
        }
      });
    } else {
      $(".alert").text("Please enter zip code").fadeIn("slow");
    }
  });



    }
}); 
