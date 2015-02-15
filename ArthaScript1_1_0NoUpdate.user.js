// ==/UserScript==
//====ADDOPERASTUFFHERE====
// ==UserScript==
// @name       ArthariaScriptNoUpdate  
// @namespace  looky
// @description  Kleines Script für artharia.de; Dank an Wurststinker und die AVB Ally
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include   http://www.artharia.de/*
// @version    1.1.0
// @copyright  nobody
// @grant GM_setClipboard
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// ==/UserScript==
//====ADDOPERASTUFFHERE====
"use strict";
console.log("Artha Script version 1.1.0 noUpdate");
$(document).ready(function () {
    helperfunc.farbgrad.init();
    if (window.location.pathname.match(new RegExp(menue.page)))
        menue.init();
    for (var moduleName in modul) {
        var module = modul[moduleName];
        if (window.location.pathname.match(new RegExp(module.page))) {
            module.init();
        }
    }
});
var modul = modul || {
};
var menue = {
    descri: 'scriptmenue',
    page: '.',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            this[mod]();
    },
    submoduls: {
        setupButton: ''
    },
    setupButton: function () {
        var newb = $('<center>' + helperfunc.createNewButton({
            "class": 'menuecat'}, {
            "width": '75%',
            "height": '40px'
        }, 'Menü') + '</center>');
        if ($('.timercat').length) {
            newb.insertAfter('.timercat');
        } else {
            newb.insertAfter('#playerCount');
        }
        $('#menu').one('click', 'button.menuecat', this.createmenue);

    },
    createmenue: function (zEvent) {
        var newSubmodulButtonYes = helperfunc.createNewButton({
            "class": 'setsubmod'
        }, {"height": '36px',
            "width": '86px'}, 'Ja');
        var newSubmodulButtonNo = helperfunc.createNewButton({
            "class": 'setsubmod'
        }, {"height": '36px',
            "width": '86px',
            "background": helperfunc.farbgrad.std.grey}, 'Nein');

        var buildhtml = '<div class="ui-tabs ui-widget ui-widget-content ui-corner-all" id="MyMenue" style="display:none">        <div class="ui-tabs-panel ui-widget-content ui-corner-bottom" id=submenue">  <h2>Artharia Script</h2>     <center><table style="float:middle; display: block-inline;" rules="all" border="0">'
                ;
        buildhtml += '<tbody><tr>';
        buildhtml += '<th>Hauptmodul</th><th>Untermodul</th><th>Aktiv?</th>';
        for (var modules in modul) {
            buildhtml += '<tr><td>' + modul[modules].descri + '</td><td></td><td></td></tr>';
            for (var submodul in modul[modules].submoduls) {
                buildhtml += '<tr><td></td><td>' + modul[modules].submoduls[submodul] + '</td>';
                buildhtml += '<td style="padding: 0px">' + submodul + '</td>';
                buildhtml += '</tr>';
            }
        }
        buildhtml += '</tr>';
        buildhtml += '</tbody>       </table></center><br style="clear: both"><br></br><h5 id="ScriReload"style="cursor: pointer;font-size:14px;">Änderungen werden nach Neuladen von Artharia übernommen.</h5></div></div>'
                ;
        var Jbuildhtml = $(buildhtml);
        Jbuildhtml.find('tr:gt(0)').each(function () {
            var node = $(this).find('td:eq(2)');
            var submodul = node.html();
            if (submodul != '') {
                if (GM_getValue('Artharia_Settings_Menue_' + submodul) === 'disabled') {
                    node.html('');
                    $(newSubmodulButtonNo).appendTo(node);
                } else {
                    node.html('');
                    $(newSubmodulButtonYes).appendTo(node);
                }
                $(this).on('click', 'button.setsubmod', submodul, function (zEvent) {                    
                    if (GM_getValue('Artharia_Settings_Menue_' + zEvent.data) === 'disabled') {
                        GM_setValue('Artharia_Settings_Menue_' + zEvent.data, 'enabled');
                        $(this).css('background', helperfunc.farbgrad.std['orange']).html('Ja');
                    } else {
                        GM_setValue('Artharia_Settings_Menue_' + zEvent.data, 'disabled');
                        $(this).css('background', helperfunc.farbgrad.std['grey']).html('Nein');
                    }
                });
            }
        });
        Jbuildhtml.find('#ScriReload').one('click', function () {
            window.location.reload();
        });
        Jbuildhtml.prependTo('#content').show('blind');
        $('#menu').on('click', '.menuecat', {
            state: 1
        }, menue.togglemenue);
    },
    togglemenue: function (zEvent) {
        if (zEvent.data.state) {
            $('#MyMenue').hide('blind');
            zEvent.data.state = 0;
        } else {
            $('#MyMenue').show('blind');
            zEvent.data.state = 1;
        }
    }
};
var modul = modul || {
};
modul.attribut = {
    descri: 'Attributsystem',
    page: 'attributes',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    reworkattri: function () {
        var attri = $('#attributes').detach();
        this.setfavs(attri);
        this.getImmu(attri);
        this.getArmor(attri);
        this.getTemps(attri);
        this.changAttri(attri);
        $('<br style="clear: both">').appendTo(attri);
        attri.appendTo('#cityOverview');
    },
    submoduls: {
        reworkattri: 'Verändert die Attributansicht.',
        insertperc: 'Entfernt Bars und setzt dafür Prozentzahlen ein.'
        , colortable: 'Kleine Style Änderungen'
    },
    colortable: function () {
        $("#cityOverview div").addClass("datagrid");
        $(".datagrid table").css({"border": "2px solid #CCC8C4", "background": "#EBE7E4"});
        $(".datagrid table th").css({"background": helperfunc.farbgrad.std.brownGrad, "color": "#000000"});
        $(".toggleFavsOn").css("background", helperfunc.farbgrad.std.orange);
    },
    insertperc: function () {
        var process_attri = function () {
            $('.attr_process').each(function () {
                $(this).find('#_percentText').html('<center><b>' + this.tooltipText + '</center></b>');
                $(this).find('#_percentImage').remove();
            });
        };
        helperfunc.scriptinjection(process_attri);
    },
    findchangedAttri: function (whatid, cols) {
        var myChangedAttri = this.myChangedAttri;
        var tablArray = new Array(cols ? 2 : 1);
        tablArray[0] = new Array();
        if (cols)
            tablArray[1] = new Array();
        var headi = $(whatid).find('tbody').eq(0);
        headi.find('tr').each(function (index) {
            var attnum = $(this).find('td').eq(1).find('span').eq(0).html();
            var attris = $(this).find('td').eq(0).html();
            if (myChangedAttri[attris]) {
                myChangedAttri[attris](attnum);
            }
            var tablentr = $(this).find('td').eq(2).html();
            if (!tablArray[0] && tablentr != null) {
                tablArray[0].push(tablentr);
                if (cols)
                    tablArray[1].push($(this).find('td').eq(3).html());
            }
            for (var i = 0; i < tablArray[0].length; i++) {
                if (tablArray[0][i] == tablentr)
                    break;
            }
            if (tablentr != null) {
                tablArray[0][i] = tablentr;
                if (cols)
                    tablArray[1][i] = ($(this).find('td').eq(3).html());
            }
        });
        return tablArray;
    },
    myChangedAttri: {
        attarr: [
            0,
            0,
            0,
            0,
            0
        ],
        'Stärke': function (incr) {
            this.attarr[0] -= incr;
        },
        'Geschicklichkeit': function (incr) {
            this.attarr[1] -= incr;
        },
        'Wendigkeit': function (incr) {
            this.attarr[2] -= incr;
        },
        'Zähigkeit': function (incr) {
            this.attarr[3] -= incr;
        },
        'Intelligenz': function (incr) {
            this.attarr[4] -= incr;
        }
    },
    setfavs: function (node) {
        // needs revision
        var togfavs = function (node) {
            node.find('tr:gt(0)').each(function () {
                if (GM_getValue('Artharia_Setting_Attribute_Favourite_' + $(this).find('td').eq(0).html().substring(0, 5)) == 'disabled')
                    $(this).hide();
                $(this).find('td:eq(1)').css('textAlign', 'center');
            });
        };
        var toggleOpenClose = function (zEvent) {
            if (zEvent.data.state) {
                zEvent.data.node.find('tr:gt(0)').find('td:eq(3)').hide();
                togfavs(zEvent.data.node);
                zEvent.data.state = 0;
            } else {
                zEvent.data.node.find('tr:gt(0)').find('td:eq(3)').show();
                zEvent.data.node.find('tr').show();
                zEvent.data.state = 1;
            }
        };
        var createExtraTab = function (zEvent) {
            var appendixTcolumn = '<td style="padding: 0px">' + helperfunc.createNewButton({"class": 'SetFavs'}, {
                height: '36px',
                width: '18px'
            }, '') + '</td>';
            var appendixFcolumn = '<td style="padding: 0px">' + helperfunc.createNewButton({"class": 'SetFavs'}, {
                height: '36px',
                background: helperfunc.farbgrad.std.grey,
                width: '18px'
            }, '') + '</td>';
            zEvent.data.node.find('tr:gt(0)').each(function () {
                if (GM_getValue('Artharia_Setting_Attribute_Favourite_' + $(this).find('td').eq(0).html().substring(0, 5)) === 'disabled') {
                    $(this).append($(appendixFcolumn));
                } else {
                    $(this).append($(appendixTcolumn));
                }
            }).find('td:eq(1)').css('textAlign', 'center');
            $('#content').on('click', '.toggleFavsOn', {
                node: zEvent.data.node,
                state: 1
            }, toggleOpenClose);
            zEvent.data.node.find('tr').show();
            var buttons = zEvent.data.node.find('tr:gt(0)');
            buttons.each(function () {
                $(this).on('click', 'button.SetFavs', $(this).find('td:eq(0)').html().substring(0, 5), function (zEvent) {
                    if (GM_getValue('Artharia_Setting_Attribute_Favourite_' + zEvent.data) == 'disabled') {
                        GM_setValue('Artharia_Setting_Attribute_Favourite_' + zEvent.data, 'enabled');
                        $(this).css('background', helperfunc.farbgrad.std['orange']);
                    } else {
                        GM_setValue('Artharia_Setting_Attribute_Favourite_' + zEvent.data, 'disabled');
                        $(this).css('background', helperfunc.farbgrad.std['grey']);
                    }
                });
            });
        };
        node.find('table').eq(0).attr('style', 'float:left; display: block-inline;').end().eq(1).attr('style', 'float:left; display: block-inline; margin-left: 30px');
        node.find('br').eq(1).remove().end().eq(0).remove();
        var sammler = node.find('table').eq(1);
        node.find('table').eq(2).find('tr:gt(0)').appendTo(sammler).end().end().remove();
        sammler.find('tr').attr('style', 'height: 37px;').eq(4).attr('style', 'height: 36px;').end().eq(0).attr('style', '');
        var headerone = sammler.find('tr:eq(0) th:eq(0) ');
        headerone.addClass("toggleFavsOn").css("background", helperfunc.farbgrad.std.orange);;
        togfavs(sammler);
        $('#content').one('click', '.toggleFavsOn', {
            node: sammler
        }, createExtraTab);
    },
    getImmu: function (node) {
        var immu = $('#immunisations').find('table').clone();
        if (!immu.length)
            immu = $(helperfunc.creatnewtable({
                headlines: [
                    'Immunität',
                    'keine vorhanden'
                ],
                clas: 'attribute',
                width: '302px'
            }));
        immu.attr('style', 'width:302px; float:left; display: block-inline;');
        immu.find('th').eq(0).html('Immunität');
        immu.appendTo(node);
    },
    getArmor: function (node) {
        $(helperfunc.creatnewtable({
            headlines: [
                'Rüstung'
            ],
            tablentr: this.findchangedAttri('#armor', 0),
            clas: 'attribute',
            marginleft: '30px',
            width: '179px'
        })).appendTo(node);
    },
    getTemps: function (node) {
        $(helperfunc.creatnewtable({
            headlines: [
                'Buffs',
                'Zeit'
            ],
            tablentr: this.findchangedAttri('#changes', 1),
            clas: 'attribute',
            marginleft: '30px',
            width: '300px'
        })).appendTo(node);
    },
    changAttri: function (node) {
        var myChangedAttri = this.myChangedAttri;
        node.find('tbody:eq(0) tr:gt(0)').each(function (index) {
            var patch = $(this).find('td:eq(1)');
            patch.html('<center><small style="font-size: 80%;">' + '(' + (parseInt(patch.find('b:eq(0)').html()) + myChangedAttri.attarr[index]) + ') </small>' + '<b> ' + patch.find('b:eq(0)').html() + '</b></center>');
        });
        node.find('tbody:eq(0) tr:eq(0) th:eq(1)').width('90px');
    }
};
var modul = modul || {
};
modul.town = {
    descri: 'Stadtübersicht',
    page: 'overview',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    submoduls: {
        reorderBuildings: 'Ordnet die Hüttenübersicht neu.' 
    },
    reorderBuildings: function () {
        if ($('#overview').length == 0)
            return;
        var overw = $('#overview').detach();
        var overwTarget = overw.find('br:eq(1)');
        var sortNodeArray;
        var nodeArray = overw.find('.ui-widget-content');

        //move into else

      
            GM_setValue('Artharia_Overview_Town_Favourites', '#');
            sortNodeArray = function (nodeA, nodeB) {
                //Inverse order!
                var prioA = modul.town.priority[$(nodeA).find('center:eq(0)').html()];
                var prioB = modul.town.priority[$(nodeB).find('center:eq(0)').html()];
                if (prioA < prioB) {
                    return 1;
                } else if (prioA > prioB) {
                    return -1;
                } else {
                    var compA = $(nodeA).find('a:eq(1)').text().toUpperCase();
                    var compB = $(nodeB).find('a:eq(1)').text().toUpperCase();
                    return (compA < compB) ? 1 : -1;
                }
            };
        nodeArray.sort(sortNodeArray);
        $.each(nodeArray, function (i, itm) {
            $(itm).insertAfter(overwTarget);
        });
        overw.appendTo('#cityOverview');
    },
    priority: {
        'Fav': 1,
        'Bank': 3,
        'Baumeister': 4,
        'Laden': 2,
        'Klinik': 5,
        'Lehrmeister': 8,
        'Tempel': 9,
        'Casino': 7,
        'Mechaniker': 6,
        'Wohnhütte': 11,
        'Gerber': 10,
        'Waffenschmiede': 10,
        'Rüstungsschmied': 10,
        'Alchemiestube': 10,
        'Verlies': 10,
        'Plantage': 10,
        'Werkzeugschmiede': 10,
        'Mühle': 10
    }
};
var modul = modul || {
};
modul.all = {
    descri: 'Global',
    page: '.',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    submoduls: {
        // rmvstaticVote: 'Entfernt den Votehinweis.',
        // rmvstaticRef: 'Entfernt den Anwerberhinweis.',
        // rmvstaticDonate: 'Entfernt den Donatehinweis.',
        dontwaitforcharac: 'Kleine UI Änderungen.',
        insertMapButton: 'Inline Karte'
    },
    dontwaitforcharac: function () {
        $('#menu_nav > li:nth-child(4)').css('minHeight', '177px');
        $('#menu_nav > li:nth-child(3)').css('minHeight', '166px');
    },
    rmvstaticVote: function () {
        $('div[messageid="voted"]').remove();
    },
    rmvstaticRef: function () {
        $('div[messageid="refer"]').remove();
    },
    rmvstaticDonate: function () {
        $('div[messageid="donate"]').remove();
    },
    insertMap: function () {
        $('<div id="inlineMap" class="ui-tabs ui-widget ui-widget-content ui-corner-all"><h4 class ="div ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"> Karte Artharias </h4><br>  <iframe src="../Memory/Map/map.php" width="100%" height="751" name="Map_in_a_box">   <p>Ihr Browser kann leider keine eingebetteten Frames anzeigen:   Sie können die eingebettete Seite über den folgenden Verweis    aufrufen: <a href="../Memory/Map/map.php">SELFHTML</a></p>   </iframe></div>'
                ).insertAfter('#contentAd');
    },
    insertMapButton: function () {
        var newb = $('<center>' + helperfunc.createNewButton({"class": 'arthamapopener'}, {
            width: '75%',
            height: '40px'
        }, 'Karte') + '</center>');
        newb.insertBefore('#menu_bottom');
        var togglemap = function (zEvent) {
            if (zEvent.data.state) {
                $('#inlineMap').hide('blind');
                zEvent.data.state = 0;
            } else {
                $('#inlineMap').show('blind');
                zEvent.data.state = 1;
            }
        };
        $('#menu').one('click', 'button.arthamapopener', function (zEvent) {
            modul.all.insertMap();
            $('#menu').on('click', 'button.arthamapopener', {
                state: 1
            }, togglemap);
        });
    }
};
var modul = modul || {
};
modul.invi = {
    descri: 'Inventarseite',
    page: 'inventar',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    submoduls: {
        appendNewcopybutton: 'Button zum Kopieren des Inventarbestands in die Zwischenablage.'
    },
    appendNewcopybutton: function () {
        this.getInventarAmount();
        var copyButton = function (zEvent) {
            var $this = $(this);
            var category = $this.attr("category");
            var ausgabe = '';

            if (modul.invi.registeredCategories[category] !== undefined) {
                for (var inventItem in modul.invi.newinvent) {
                    if (modul.invi.newinvent[inventItem].kategorie[category] && modul.invi.newinvent[inventItem].amount > 0) {
                        if (ausgabe != '')
                            ausgabe = ausgabe + ', ';
                        ausgabe = ausgabe + modul.invi.newinvent[inventItem].amount + ' ' + modul.invi.newinvent[inventItem].name;
                    }
                }

                GM_setClipboard('Es wurden ' + modul.invi.registeredCategories[category].amount + ' ' + category + ' gefunden: ' + ausgabe);
            }
        };


        var prepareResources = $('<a><br></br></a>');
        var preparePlants = $('<a><br></br></a>');

        for (var buttontitle in modul.invi.registeredCategories)
        {
            if (this.registeredCategories[buttontitle].belonging == 1) {
                prepareResources.append(helperfunc.createNewButton({
                    "class": "myCopyButtons",
                    "category": buttontitle
                },
                {"width": '160px',
                    "height": '40px',
                    "background": helperfunc.farbgrad.std.orange},
                buttontitle + ' (' + modul.invi.registeredCategories[buttontitle].amount + ')'));
            } else {
                preparePlants.append(helperfunc.createNewButton({
                    "class": "myCopyButtons",
                    "category": buttontitle
                },
                {"width": '130px',
                    "height": '40px',
                    "background": helperfunc.farbgrad.std.orange},
                buttontitle + ' (' + modul.invi.registeredCategories[buttontitle].amount + ')'));
            }
        }
        prepareResources.on('click', '.myCopyButtons', copyButton);
        preparePlants.on('click', '.myCopyButtons', copyButton);
        $("#resources").append(prepareResources);
        $("#plants").append(preparePlants);
    },
    getInventarAmount: function () {
        var weight = 0;
        var countTogether = function (idx, $this) {
            var objecttype = $(this).parent().attr("objecttype");
            if (objecttype == 3) {
                // Resources and plants
                var objId = $($this).attr('objectid');
                if (objId !== undefined && parseInt(objId) < 79) {
                    var amount = parseInt($($this).find('small').html());
                    modul.invi.newinvent[objId].amount = amount;
                    weight += amount * modul.invi.newinvent[objId].weight;
                    for (var categories in modul.invi.newinvent[objId].kategorie) {
                        modul.invi.registeredCategories[categories].amount = modul.invi.registeredCategories[categories].amount + amount;
                    }
                }
            } else if (objecttype == 2) {
                // Tools
                var objId = $($this).attr('objectid');
                if (objId !== undefined && parseInt(objId) < 29) {
                    var amount = parseInt($($this).find('small').html());
                    modul.invi.tools[objId].amount = amount;
                    weight += amount * modul.invi.tools[objId].weight;
                }

            } else if (objecttype == 5) {
                // Potions
                var stringExtract = $($this).find(".myInventarObject").attr("src").slice(88, -4);
                if (modul.invi.potions[stringExtract]) {
                    modul.invi.potions[stringExtract].amount += 1;
                    weight += modul.invi.potions[stringExtract].weight;
                } else {
                    console.log(objecttype + ':' + stringExtract);
                }

            } else if (objecttype == 8) {
                // Armor

                var objectid = $($this).find("input:eq(1)").attr("value");
                modul.invi.armor[objectid].amount += 1;
                weight += modul.invi.armor[objectid].weight;

            } else if (objecttype == 1) {
                // Weapons
                var stringExtract = $($this).find(".myInventarObject").attr("src").slice(90, -4);
                if (modul.invi.weapons[stringExtract]) {
                    modul.invi.weapons[stringExtract].amount += 1;
                    weight += modul.invi.weapons[stringExtract].weight;
                } else {
                    console.log(objecttype + ':' + stringExtract);

                }
            }
        };

        //$("#resources").find('.inventarObject').each(countTogether);
        //$("#plants").find('.inventarObject').each(countTogether);
        $("#inventarTabs").find('.inventarObject').each(countTogether);
    },
    registeredCategories: {
        "Alles": {amount: 0, belonging: 1},
        "Ressourcen": {amount: 0, belonging: 1},
        "Erze": {amount: 0, belonging: 1},
        "Baustoffe": {amount: 0, belonging: 1},
        "Pflanzen": {amount: 0, belonging: 2},
        "Spritzen": {amount: 0, belonging: 2},
        "Trash": {amount: 0, belonging: 2},
        "Tinte": {amount: 0, belonging: 2},
        "Inselgüter": {amount: 0, belonging: 1}
    }, // 1 - Append to Resources; 2 - Append to Pflanzen
    newinvent: {
        '1': {name: 'Holz', weight: 1, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '2': {name: 'Stein', weight: 1.5, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '3': {name: 'Wasser', weight: 3, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '4': {name: 'Lehm', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '5': {name: 'Ton', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '6': {name: 'Fell', weight: 6, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '7': {name: 'Eisen', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Erze": 1}, amount: 0},
        '8': {name: 'Gold', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Erze": 1}, amount: 0},
        '9': {name: 'Silber', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Erze": 1}, amount: 0},
        '10': {name: 'Edelstein', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '11': {name: 'Kupfer', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1, "Erze": 1}, amount: 0},
        '12': {name: 'Zinn', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1, "Erze": 1}, amount: 0},
        '13': {name: 'Quarz', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Erze": 1}, amount: 0},
        '14': {name: 'Aloe Vera', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '15': {name: 'Engelwurz', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1}, amount: 0},
        '16': {name: 'Rauschpfeffer', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '17': {name: 'Currax', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '18': {name: 'Callidus', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '19': {name: 'Brennnessel', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '20': {name: 'Holunder', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '21': {name: 'Wermut', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '22': {name: 'Boxhornklee', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '23': {name: 'Eukalyptus', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '24': {name: 'Juckbohne', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1}, amount: 0},
        '25': {name: 'Ginseng', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Spritzen": 1}, amount: 0},
        '26': {name: 'Eola Arev', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '27': {name: 'Wurmfarne', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '28': {name: 'Oleander', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Tinte": 1}, amount: 0},
        '29': {name: 'Seidelbast', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1}, amount: 0},
        '30': {name: 'Nachtschatten', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Tinte": 1}, amount: 0},
        '31': {name: 'Eisenhut', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Tinte": 1}, amount: 0},
        '32': {name: 'Opium', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '33': {name: 'Necopi Nuss', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '34': {name: 'Trügerknolle', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1, "Trash": 1}, amount: 0},
        '35': {name: 'Ebrius', weight: 1, kategorie: {"Alles": 1, "Pflanzen": 1}, amount: 0},
        '36': {name: 'Baumwolle', weight: 1, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1, "Pflanzen": 1}, amount: 0},
        '37': {name: 'Fleisch', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '38': {name: 'Bronze', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '39': {name: 'Karpfen', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '40': {name: 'Hecht', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '41': {name: 'Regenbogenfisch', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '42': {name: 'Riffhai', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '43': {name: 'Leder', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1, "Baustoffe": 1}, amount: 0},
        '44': {name: 'Brot', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '45': {name: 'Weizen', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '46': {name: 'Heu', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '47': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '48': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '49': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '50': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '51': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '52': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '53': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '54': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '55': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '56': {name: 'Artefakt', weight: -1, kategorie: {}, amount: 0},
        '57': {name: 'Geschenk', weight: 0, kategorie: {}, amount: 0},
        '58': {name: 'Papyrus', weight: 12, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '59': {name: 'signiertes Papyrus', weight: 10, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '60': {name: 'Feder', weight: 0.2, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '61': {name: 'Trakehner', weight: 0, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '62': {name: 'Tinte', weight: 3, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '63': {name: 'Zinnsiegel', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '64': {name: 'Silbersiegel', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '65': {name: 'Edelsteinsiegel', weight: 5, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '66': {name: 'Rubin', weight: 30, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '67': {name: 'Smaragd', weight: 20, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '68': {name: 'Titan', weight: -1, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '69': {name: 'Goldrute', weight: 3, kategorie: {"Alles": 1, "Inselgüter": 1}, amount: 0},
        '70': {name: 'Kartoffel', weight: 2, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0},
        '71': {name: 'Celeritas', weight: -1, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '72': {name: 'unbekannt', weight: -1, kategorie: {"Alles": 1}, amount: 0},
        '73': {name: 'Larvenkokon', weight: 0.5, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '74': {name: 'Panzerplatte', weight: 15, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '75': {name: 'Feinfaser', weight: -1, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '76': {name: 'Eintopf', weight: 0, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '77': {name: 'Celeritastrank', weight: -1, kategorie: {"Alles": 1, "Ressourcen": 1, "Inselgüter": 1}, amount: 0},
        '78': {name: 'Fischschuppen', weight: 3, kategorie: {"Alles": 1, "Ressourcen": 1}, amount: 0}
    }, //
    tools: {
        '1': {name: 'Smaragdpickel', weight: 70, kategorie: {}, amount: 0},
        '2': {name: 'Silberkeil', weight: 45, kategorie: {}, amount: 0},
        '3': {name: 'Keilhaue', weight: -1, kategorie: {}, amount: 0},
        '4': {name: 'Spitzhacke', weight: 20, kategorie: {}, amount: 0},
        '5': {name: 'Spaten', weight: 22, kategorie: {}, amount: 0},
        '6': {name: 'Bronzepickel', weight: 13, kategorie: {}, amount: 0},
        '7': {name: 'Steinhacke', weight: 30, kategorie: {}, amount: 0},
        '8': {name: 'Mörser', weight: 30, kategorie: {}, amount: 0},
        '9': {name: 'Reagenzglas', weight: 13, kategorie: {}, amount: 0},
        '10': {name: 'Rundkolben', weight: -1, kategorie: {}, amount: 0},
        '11': {name: 'Bürette', weight: 28, kategorie: {}, amount: 0},
        '12': {name: 'Exsikkator', weight: 35, kategorie: {}, amount: 0},
        '13': {name: 'Axt', weight: 20, kategorie: {}, amount: 0},
        '14': {name: 'Handschaufel', weight: 20, kategorie: {}, amount: 0},
        '15': {name: 'Zelt', weight: 25, kategorie: {}, amount: 0},
        '16': {name: 'Angel', weight: 20, kategorie: {}, amount: 0},
        '17': {name: 'Eimer', weight: 10, kategorie: {}, amount: 0},
        '18': {name: 'Spritze (8 Ap)', weight: 2, kategorie: {}, amount: 0},
        '19': {name: 'Spritze (5 Ap)', weight: 2, kategorie: {}, amount: 0},
        '20': {name: 'Spritze (11 Ap)', weight: 2, kategorie: {}, amount: 0},
        '21': {name: 'Wanderbeutel', weight: 5, kategorie: {}, amount: 0},
        '22': {name: 'Wandersack', weight: 12, kategorie: {}, amount: 0},
        '23': {name: 'Großer Rucksack', weight: 25, kategorie: {}, amount: 0},
        '24': {name: 'komische Schuhe', weight: 10, kategorie: {}, amount: 0},
        '25': {name: 'Fußketten', weight: 5, kategorie: {}, amount: 0},
        '26': {name: 'Viriditashaue', weight: 100, kategorie: {}, amount: 0},
        '27': {name: 'Rubinpickel', weight: -1, kategorie: {}, amount: 0},
        '28': {name: 'Kräutersichel', weight: 80, kategorie: {}, amount: 0}
    },
    weapons: {
        'battlestick': {name: 'Kampfstock', weight: 100, kategorie: {}, amount: 0},
        'dagger': {name: 'Dolch', weight: 100, kategorie: {}, amount: 0},
        'shortsword': {name: 'Kurzschwert', weight: 160, kategorie: {}, amount: 0},
        'longsword': {name: 'Langschwert', weight: 250, kategorie: {}, amount: 0},
        'mace': {name: 'Morgenstern', weight: 250, kategorie: {}, amount: 0},
        'spear': {name: 'Speer', weight: -1, kategorie: {}, amount: 0},
        'crossbow': {name: 'Armbrust', weight: -1, kategorie: {}, amount: 0},
        'bow': {name: 'Bogen', weight: 130, kategorie: {}, amount: 0},
        'battle-hammer': {name: 'Kampfhammer', weight: 190, kategorie: {}, amount: 0},
        'battle-axe': {name: 'Streitaxt', weight: 220, kategorie: {}, amount: 0},
        'lordsword': {name: 'Edelschwert', weight: -1, kategorie: {}, amount: 0},
        'lance': {name: 'Lanze', weight: -1, kategorie: {}, amount: 0}
    },
    armor: {
        '1': {name: 'Spangenhelm', weight: 100, kategorie: {}, amount: 0},
        '2': {name: 'Barbuta', weight: 150, kategorie: {}, amount: 0},
        '3': {name: 'Topfhelm', weight: -1, kategorie: {}, amount: 0},
        '4': {name: 'Buckler', weight: 110, kategorie: {}, amount: 0},
        '5': {name: 'Kampfschild', weight: 100, kategorie: {}, amount: 0},
        '6': {name: 'Löwenschild', weight: -1, kategorie: {}, amount: 0},
        '7': {name: 'Lederhandschuhe', weight: 100, kategorie: {}, amount: 0},
        '8': {name: 'Kettenhandschuhe', weight: 20, kategorie: {}, amount: 0},
        '9': {name: 'Panzerhandschuhe', weight: -1, kategorie: {}, amount: 0},
        '10': {name: 'Kampfstulpe', weight: 60, kategorie: {}, amount: 0},
        '11': {name: 'Kettenarmschutz', weight: 110, kategorie: {}, amount: 0},
        '12': {name: 'Stahlelle', weight: -1, kategorie: {}, amount: 0},
        '13': {name: 'Lederschiene', weight: 40, kategorie: {}, amount: 0},
        '14': {name: 'Plattenschiene', weight: 100, kategorie: {}, amount: 0},
        '15': {name: 'Stahlschiene', weight: -1, kategorie: {}, amount: 0},
        '16': {name: 'Lederschuhe', weight: 10, kategorie: {}, amount: 0},
        '17': {name: 'Plattenschuhe', weight: 30, kategorie: {}, amount: 0},
        '18': {name: 'Tigerschuhe', weight: -1, kategorie: {}, amount: 0},
        '19': {name: 'Brustpanzer', weight: -1, kategorie: {}, amount: 0},
        '20': {name: 'Kettenhemd', weight: 120, kategorie: {}, amount: 0},
        '21': {name: 'Lamellenpanzer', weight: -1, kategorie: {}, amount: 0}
    },
    potions: {
        '8': {name: 'Mörsertrank', weight: 20, kategorie: {}, amount: 0},
        '9': {name: 'Reagenzglastrank', weight: 35, kategorie: {}, amount: 0},
        '10': {name: 'Rundkolbentrank', weight: -1, kategorie: {}, amount: 0},
        '11': {name: 'Bürettentrank', weight: 100, kategorie: {}, amount: 0},
        '12': {name: 'Exsikkatortrank', weight: 150, kategorie: {}, amount: 0}
    }
};
var modul = modul || {
};
modul.ally = {
    descri: 'Allianzansicht',
    page: 'Alliance',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    submoduls: {
        changeAllyButtons: 'Fügt Button für Pinnwand und Lager hinzu.',
        transposeAllyStatics: 'Schiebt Hinweise unter die Allianzansicht.'
    },
    changeAllyButtons: function () {
        var memb = $('#memberships').find('table').eq(0).detach();
        memb.find('tr:eq(0)').find('th:eq(2)').html('');
        memb.find('tr:gt(0)').each(function (index) {
            var $this = $(this);
            var oldtext = $this.find('td').eq(0).html();
            $this.find('td').eq(0).html('<a style="padding 0.1em" href="' + $this.find('td:eq(3)').find('a:eq(2)').attr('href') + '"><center>' + helperfunc.createNewButton({"class": oldtext},
            {"width": '250px',
                "height": '32px'
            }, oldtext) + '</center></a>');
            if ($this.find('td:eq(3)').find('a:eq(4)').length > 0 & ($this.find('td:eq(3)').find('a:eq(4)').find('img').attr('src').match(/disabled/) + 1)) {
                $this.find('td').eq(2).html('<a style="padding 0.1em" href="' + $this.find('td:eq(3)').find('a:eq(4)').attr('href') + '"><center>' + helperfunc.createNewButton({
                }, {"width": '90px',
                    "height": '32px'
                }, 'Lager') + '</center></a>');
            } else {
                $this.find('td').eq(2).html('<a style="padding 0.1em" href="' + $this.find('td:eq(3)').find('a:eq(4)').attr('href') + '"><center>' + helperfunc.createNewButton({}, {
                    "width": '90px',
                    "height": '32px',
                    "background": helperfunc.farbgrad.std.grey
                }, 'Lager') + '</center></a>');
            }
        });
        memb.appendTo('#memberships');
    },
    transposeAllyStatics: function () {
        $('#staticInfoBoxes').insertAfter('#allianceTabs');
    }
};
var modul = modul || {
};
modul.allypinn = {
    descri: 'Ally-Pinnwand',
    page: 'guestbook',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();
    },
    submoduls: {
        appendStoreButton: 'Fügt einen Link zum entsprechenden Allylager hinzu.'
    },
    appendStoreButton: function () {
        var storebutton = $('<a>' + helperfunc.createNewButton({
            "class": 'storeButton ui-button ui-widget ui-state-default ui-corner-all'},
        {"width": '130px',
            "height": '27px',
            "background": '',
            "font-weight": "normal"
        }, 'Lager') + '</a>');
        storebutton.attr('href', 'http://www.artharia.de/Alliance/store.php' + window.location.search);
        storebutton.insertAfter('#showWriteForm');
    }
};
var modul = modul || {
};
modul.allyStore = {
    descri: 'Ally-Lager',
    page: 'store.php',
    version: '1',
    init: function () {
        for (var mod in this.submoduls)
            if (GM_getValue('Artharia_Settings_Menue_' + mod) != 'disabled')
                this[mod]();      
    },
    submoduls: {
        allInOne: 'Bringt alle Items in einen Tab zusammen.',
        appendGuestButton: 'Fügt einen Link zur entsprechenden Pinnwand hinzu.',
        addCounter: 'Fügt Anzahl der eingelagerten Gegenstände hinzu.',
        reArrange: 'Verändert die Darstellung des Lagers.'
    },
    allInOne: function () {
        $('#storeTabs').find('.ui-state-active').removeClass('ui-state-active ui-tabs-selected ');
        $('#storeTabs').children('div').each(function () {
            if ($(this).find('table').length)
                $(this).removeClass('ui-tabs-hide');
        });
    },
    appendGuestButton: function () {
        $('<li class="ui-state-default ui-corner-top"><a href="#" class="swAll "> Alles </a></li>').appendTo('.ui-tabs-nav');
        $('#storeTabs').on('click', '.swAll', function () {
            modul.allyStore.allInOne();
            $(this).parent().addClass('ui-state-active ui-tabs-selected');
        });
        $('<li class="ui-state-default ui-corner-top"><a href="http://www.artharia.de/Alliance/guestbook.php' + window.location.search + '">Pinnwand</a></li>').appendTo('.ui-tabs-nav');
    },
    addCounter:
            function () {
                var ablegen = $('#content').children('div').eq(2).children('div:eq(1)').find('h4');
                ablegen.html(ablegen.html() + ' (' + $('#storeTabs').find("div:lt(4)").find('tr').length + '/' + $('#content').children('div').eq(2).children('div:eq(2)').find('b:eq(1)').html() + ')');
            },
    reArrange: function () {
        var worker = $('#storeTabs').parent().parent();
        var worktable = $('#storeTabs').parent().detach();
        worktable.find('#storeTabs').css({
            'margin-bottom': '90px',
            width: '49%',
            float: 'left'
        });
        worktable.children('div').eq(1).addClass('ui-tabs ui-widget ui-widget-content ui-corner-all').css({
            float: 'right',
            width: '48%',
            'margin-left': '5px',
            'margin-top': '0px'
        }).find('h4').addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
        worktable.children('div').eq(2).addClass('ui-tabs ui-widget ui-widget-content ui-corner-all').css({
            float: 'right',
            width: '48%',
            'margin-left': '5px',
            'margin-top': '5px'
        }).find('h4').addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
        worktable.children('br').remove();
        var worktemp = worktable.find('#storeTabs').find('ul:eq(0)');
        $(' <br></br>').insertAfter(worktemp.find('li:eq(3)'));
        worktemp.children('li').slice(0, 4).css({
            'border-bottom-right-radius': '6px',
            'border-bottom-left-radius': '6px'
        }).end().eq(4).css('margin-left', '55px');
        worktable.appendTo(worker);
    }
};
var helperfunc = {
    scriptinjection: function (source) {
        //http: wiki.greasespot.net/Content_Script_Injection
        // Check for function input.
        if ('function' == typeof source) {
            // Execute this function with no arguments, by adding parentheses.
            // One set around the function, required for valid syntax, and a
            // second empty set calls the surrounded function.
            source = '(' + source + ')();';
        }
        // Create a script node holding this  source code.

        var script = document.createElement('script');
        script.setAttribute('type', 'application/javascript');
        script.textContent = source;
        // Insert the script node into the page, so it will run, and immediately
        // remove it to clean up.
        document.body.appendChild(script);
        document.body.removeChild(script);
    },
    creatnewtable: function (newsetup) {
        var contenti = {
            headlines: new Array(),
            tablentr: new Array(),
            clas: '',
            rules: 'all',
            border: '0',
            floa: 'left',
            display: 'block-inline',
            width: '50px',
            marginleft: '0px'
        };
        $.extend(contenti, newsetup);
        var htmltable = '';
        if (contenti.headlines.length == 0)
            return 'zero';
        htmltable += '<table ' + (contenti.clas == '' ? '' : ('class="' + contenti.clas + '"')) + 'rules="' + contenti.rules + '" border="' + contenti.border + '" style="float:' + contenti.floa + '; width:' + contenti.width + '; display: ' + contenti.display + '; margin-left:' + contenti.marginleft + ' "><tbody><tr>';
        contenti.headlines.forEach(function (element) {
            htmltable += '<th>' + element + '</th>';
        });
        htmltable += '</tr>';
        if (contenti.tablentr.length) {
            var colm = contenti.tablentr.length > contenti.headlines.length ? contenti.headlines.length : contenti.tablentr.length;
            var row = contenti.tablentr[0].length;
            for (var i = 0; i < row; i++) {
                htmltable += '<tr>';
                for (var k = 0; k < colm; k++) {
                    htmltable += '<td>' + (contenti.tablentr[k][i] ? contenti.tablentr[k][i] : '') + '</td>';
                }
                htmltable += '</tr>';
            }
        }
        htmltable += '</table></tbody>';
        return htmltable;
    },
    farbgrad: {
        std: {
            orange: '#eac380',
            grey: '#dfdfdf',
            blueish: '#4417F6',
            yelgre: "#E6D396",
            brownGrad: '#c9b89e',
            brown: '#c9b89e', // ArthaStandardTable
            white: '#fcfcfc', // ArthaStandardTable odd
            lightbrown: '#DDBD92', // ArthaStandard
            green: '#238A09',
            greygreen: '#95AA8D',
            greylightgreen: '#E4E6E4'
        },
        foxxi: {
            orange: '-moz-linear-gradient( center top, #fae4bd 5%, #eac380 100% )',
            grey: ' -moz-linear-gradient( center top, #ededed 5%, #dfdfdf 100% )',
            yelgre: '-moz-linear-gradient( center top, #DEE69E 5%, #E6D396 100% )',
            brownGrad: '-moz-linear-gradient( center top, #DDBD92 5%, #c9b89e 100% )',
            green: '-moz-linear-gradient( center top, #53CC34 5%, #238A09 100% )',
            greygreen: ' -moz-linear-gradient( center top, #ededed 5%, #87BA74 100% )',
            greylightgreen: ' -moz-linear-gradient( center top, #C5D5C5 5%, #E4E6E4 100% )'
        },
        chrome: {
            orange: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#fae4bd),color-stop(100%,#eac380))',
            grey: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#ededed),color-stop(100%,#dfdfdf))',          
            yelgre: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#DEE69E),color-stop(100%,#E6D396))',
            brownGrad: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#DDBD92),color-stop(100%,#c9b89e))',
            green:'-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#53CC34),color-stop(100%,#238A09))',
            greygreen: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#ededed),color-stop(100%,#87BA74))',
            greylightgreen: '-webkit-gradient( linear, left top, left bottom, color-stop( 5%,#C5D5C5),color-stop(100%,#E4E6E4))'
        },
        init: function () {
            var nAgt = navigator.userAgent;
            var verOffset;


            if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                // "Firefox";
                $.extend(helperfunc.farbgrad.std, helperfunc.farbgrad.foxxi);
            }
            else if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
                // "Opera";

            }
            else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                //"Opera";

            }
            else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                // "Microsoft Internet Explorer";

            }
            else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                //"Chrome";
                $.extend(helperfunc.farbgrad.std, helperfunc.farbgrad.chrome);
            }
            else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                // "Safari";

            }


        }
    },
    createNewButton: function (newsetup, newstyles, buttontext) {
        var contenti = {
            "class": 'mybutton'
        };
        var styles = {
            "padding": '0px',
            "text-align": 'center',
            "height": '30px',
            "width": '50px',
            "background": helperfunc.farbgrad.std.orange,
            "font-weight": 'bold',
            "font-color": '#444'
        };
        $.extend(contenti, newsetup);
        $.extend(styles, newstyles);
        var buildhtml = '<button';
        for (var buttonentries in contenti) {
            buildhtml += ' ' + buttonentries + '="' + contenti[buttonentries] + '"';
        }
        buildhtml += ' style="';
        for (var buttonentries in styles) {
            buildhtml += ' ' + buttonentries + ':' + styles[buttonentries] + '; ';
        }
        buildhtml += '">';
        buildhtml += '<small>' + buttontext + '</small>';
        buildhtml += '</button>';
        return buildhtml;
    }
};
