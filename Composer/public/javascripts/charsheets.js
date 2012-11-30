$(function() {
  $("html, body").addClass("postload");

  $("#start-single").click(function () {
    $("#class-tab-link, #options-tab-link, #download-tab-link").show();
    $("#start-tab-link, #party-tab-link").hide();
    $("#class-tab-link").click();
    $("#add-to-party").hide();
    $("#party-readout").hide();
    $("#start-type").val('single');
    return false;
  });

  $("#start-party").click(function () {
    $("#class-tab-link, #options-tab-link, #party-tab-link, #download-tab-link").show();
    $("#start-tab-link").hide();
    $("#class-tab-link").click();
    $("#party-readout").show();
    $("#add-to-party").show();
    $("#start-type").val('party');
    return false;
  });

  $("#start-gm").click(function () {
    $("#download-tab-link").show().click();
    $("#start-tab-link, #party-tab-link, #class-tab-link, #options-tab-link").hide();
    $("#add-to-party").hide();
    $("#party-readout").hide();
    $("#start-type").val('gm');
  });

  $("a.lightbox").click(function () {
    var id = $(this).attr('rel');
    var lightbox = $(id);
    if (lightbox) {
      var img = lightbox.find("img");
      var src = img.attr('src');
      img.attr('src', '');
      img.attr('src', src).load(function () {
        console.log("image loaded!");
        var outer = lightbox.innerHeight();
        var inner = img.outerHeight();
        var margin = (outer - inner) / 2;
        lightbox.find("> *").css("margin-top", margin+"px");
      });
      lightbox.fadeIn("fast");
      return false;
    }
    return true;
  });

  $("div.lightbox").click(function () {
    $(this).fadeOut("fast");
  });
  $("div.lightbox .note").click(function () {
    return false;
  });

  $("nav.tabs a").click(function () {
    var rel = $(this).attr('rel');
    var target = $(rel);
    if (target.is("section.tab")) {
      // show the tab pane
      $("section.tab").removeClass('selected');
      target.addClass('selected');

      // select the tab label
      $("nav.tabs a").removeClass('selected');
      $(this).addClass('selected');

      // april fool
      if ($("body").is(".april-fool") && cornify_add && Math.random() > 0.8) {
        cornify_add();
      }
      return false;
    }
    return true;
  });

  $("a[href^='#']").click(function () {
    var href = $(this).attr('href');
    var target = $(href);
    if (target.is("section.tab")) {
      // show the tab pane
      $("section.tab").removeClass('selected');
      target.addClass('selected');

      // select the tab label
      $("nav.tabs a").removeClass('selected');
      $("nav.tabs a[rel='"+href+"']").addClass('selected');

      // april fool
      if ($("body").is(".april-fool") && cornify_add && Math.random() > 0.8) {
        cornify_add();
      }
      return false;
    }
    return true;
  });

  var current_inventory_src;
  function update_iconic() {
    $("#options-tab .inventory-iconic-set").hide();
    $("#iconic img").removeClass("selected");
    $('#inventory-iconic-custom').hide();

    var option = $("#inventory-iconic-set option:selected");
    var value = option.val();
    if (value == "default") {
      $('#inventory-iconic').val('default');
      $('#iconic-default').addClass("selected");
      return;
    }

    if (value == "custom") {
      $('#inventory-iconic').val('custom');
      $('#inventory-iconic-custom').show();
      return;
    }

    var setSelect = $(option.attr('rel'));
    setSelect.show();

    option = setSelect.find("option:selected")
    var rel = option.attr('rel');
    var img = $(rel).addClass("selected");
    var src = img.attr('data-src')
    img.attr('src', src);
    current_inventory_src = src;

    $("#inventory-iconic").val(option.val());
  }
  $("#inventory-iconic-set, .inventory-iconic-set").change(update_iconic);
  update_iconic();

  var nextcharid = 1;
  $("#add-to-party").click(function () {
    var form = $("#build-my-character");
    var inputs = form.find("input").not("[data-charid]");
    var charid = nextcharid; nextcharid++;

    // collect all the character data
    var chardata = {};
    inputs.each(function () {
      var input = $(this);
      if (input.attr('type') == 'radio' && !input.is(":checked")) {
        return;
      }
      var name = input.attr('name');
      var value = input.attr('value');
      if (input.attr('type') == 'checkbox') {
        value = input.is(":checked") ? "on" : "";
      }
      chardata[name] = value;
    });

    // store the data in hidden fields
    for (name in chardata) {
      var value = chardata[name];
      $("<input type='hidden' name='char-"+charid+"-"+name+"' data-charid='"+charid+"' />").val(value).appendTo(form);
    }

    // interpret the data
    var classes = [];
    for (name in chardata) {
      if (name.slice(0, 6) == 'class-' && chardata[name] == 'on') {
        classes.push(name.slice(6));
      }
    }

    // add the character to the list
    var readout = $("#party-readout ul");
    var img = current_inventory_src;
    $("<li><img src='"+img+"'/><span>"+classes.join(", ")+"</span></li>").appendTo(readout);
    var charids = $("#charids");
    var ids = charids.val().split(",");
    ids.push(charid);
    charids.val(ids.join(","));

    // move along
    $("#party-tab-link").click();
  });
});