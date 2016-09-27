var counter = 0;

function sendMessage(){
  console.log("Message Sent!!");
  $.ajax({
        type: "POST",
        url: "https://android.googleapis.com/gcm/send",
        beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("Authorization", "key=AIzaSyCH44qhsh-Bv26-nAk8WH0Uyp-isoWkWY4");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
        data: JSON.stringify({
            registration_ids: [subscriptionId] // eslint-disable-line camelcase
        })
      });
}
function initiateMessages(){
  console.log("Init");
  // setTimeout(function(){
  //   $('.carousel').carousel({
  //     interval: 2000
  //   });
  // },1500);

  var intervalObject = setInterval(function(){

    var randomnumber = Math.floor(Math.random() * (2 - 0 + 0)) + 0;
    switch (randomnumber) {
      case 0:
        moreAlertsObjectGlobal[0].alert.push({
          "name":"testSnow",
          "header":"Light Snow Expected Tomorrow - New",
          "date":"Mon 26 April 2016 17:27",
          "icon":"fa-cloud",
          "active":true,
          "id":"weather1",
          "type":"snow",
          "selected":false,
          "action":[
            {
              "id":"snow_action1",
              "subtext":"Action - 1",
              "text":"Switch On Only  70% of Lights",
              "selected":false,
              "recomended":true
            },
            {
              "id":"snow_action2",
              "subtext":"Action - 2",
              "text":"Check Rain Coat, Hot Soup, Chicken and Beer on Shelf stock",
              "selected":false,
              "recomended":false
            },
            {
              "id":"snow_action3",
              "subtext":"Action - 3",
              "text":"Adjust Humidifier on AC",
              "selected":false,
              "recomended":false
            }
          ]
        });
        $($($(".pods")[0]).children()[0]).addClass("highlight").delay(800).queue(function(){
            $(this).removeClass("highlight").dequeue();
        });
        break;
      case 1:
          moreAlertsObjectGlobal[1].alert.push({
            "name":"prince",
            "header":"Some Stock Alert Dynamically Added",
            "date":"Mon 26 April 2016 00:01",
            "icon":"fa-music",
            "active":true,
            "id":"stock1",
            "type":"stockout",
            "selected":false,
            "action":[
              {
                "id":"prince_cd_stock_out",
                "subtext":"Action - 1",
                "text":"Get item from nearby store",
                "selected":false,
                "recomended":true
              },
              {
                "id":"clear_sky_action2",
                "subtext":"Action - 2",
                "text":"Put substitute items on shelf",
                "selected":false,
                "recomended":false
              },
              {
                "id":"clear_sky_action3",
                "subtext":"Action - 3",
                "text":"Send PO to nearby DC",
                "selected":false,
                "recomended":false
              }
            ]
          });
          $($($(".pods")[1]).children()[0]).addClass("highlight").delay(800).queue(function(){
              $(this).removeClass("highlight").dequeue();
          });
          break;
      case 3:
            moreAlertsObjectGlobal[2].alert.push({
              "name":"furnace",
              "header":"Store Alert - Dynamically Added",
              "date":"Mon 26 April 2016 00:01",
              "icon":"fa-bullhorn",
              "active":true,
              "id":"furnace1",
              "type":"furnace",
              "selected":false,
              "action":[
                {
                  "id":"furnace_maintenance_1",
                  "subtext":"Action - 1",
                  "text":"Call HVAC Support: 888.498.0765",
                  "selected":false,
                  "recomended":true
                },
                {
                  "id":"furnace_maintenance_1",
                  "subtext":"Action - 2",
                  "text":"Clean the filter",
                  "selected":false,
                  "recomended":false
                },
                {
                  "id":"furnace_maintenance_3",
                  "subtext":"Action - 3",
                  "text":"Replace the filter",
                  "selected":false,
                  "recomended":false
                }
              ]
            });
            $($($(".pods")[2]).children()[0]).addClass("highlight").delay(800).queue(function(){
                $(this).removeClass("highlight").dequeue();
            });
            break;
    }
    var scope = angular.element($(".pods")[0]).scope();
    if(undefined != scope)
    {
      scope.$apply(function(){
          scope.msg = 'Superhero';
      })
    }

    counter++;
    sendMessage();
    if(counter > 4)
    {
      clearInterval(intervalObject);
    }
  },5000);
}

var similarAlertsObject = {};

var moreAlertsObjectGlobal = [
  {
    "text":"Weather",
    "icon":"fa-cloud",
    "alert":[
      {
        "name":"snow",
        "header":"Light Snow Expected Tomorrow",
        "date":"Mon 26 April 2016 17:27",
        "icon":"fa-cloud",
        "active":true,
        "id":"weather1",
        "type":"snow",
        "selected":false,
        "actions":[
          {
            "id":"snow_action1",
            "subtext":"Action - 1",
            "text":"Switch On Only  70% of Lights",
            "selected":false,
            "recomended":true
          },
          {
            "id":"snow_action2",
            "subtext":"Action - 2",
            "text":"Check Rain Coat, Hot Soup, Chicken and Beer on Shelf stock",
            "selected":false,
            "recomended":false
          },
          {
            "id":"snow_action3",
            "subtext":"Action - 3",
            "text":"Adjust Humidifier on AC",
            "selected":false,
            "recomended":false
          }
        ]
      },
      {
        "name":"heavysnow",
        "header":"Heavy Snow Expected Tomorrow",
        "date":"Mon 26 April 2016 17:27",
        "icon":"fa-cloud",
        "active":true,
        "id":"weather2",
        "type":"heavysnow",
        "selected":false,
        "actions":[
          {
            "id":"heavy_snow_action1",
            "subtext":"Action - 1",
            "text":"Bring out the Showels",
            "selected":false,
            "recomended":false
          },
          {
            "id":"heavy_snow_action2",
            "subtext":"Action - 2",
            "text":"Some Data Change",
            "selected":false,
            "recomended":false
          },
          {
            "id":"heavy_snow_action3",
            "subtext":"Action - 3",
            "text":"Adjust Humidifier on AC",
            "selected":false,
            "recomended":true
          }
        ]
      },
      {
        "name":"clearsky",
        "header":"Clear Sky Expected Tomorrow",
        "date":"Mon 27 April 2016 17:27",
        "icon":"fa-cloud",
        "active":true,
        "id":"weather3",
        "type":"clearsky",
        "selected":false,
        "actions":[
          {
            "id":"clear_sky_action1",
            "subtext":"Action - 1",
            "text":"Switch On Only  70% of Lights",
            "selected":false,
            "recomended":true
          },
          {
            "id":"clear_sky_action2",
            "subtext":"Action - 2",
            "text":"Check Rain Coat, Hot Soup, Chicken and Beer on Shelf stock",
            "selected":false,
            "recomended":false
          },
          {
            "id":"clear_sky_action3",
            "subtext":"Action - 3",
            "text":"Adjust Humidifier on AC",
            "selected":false,
            "recomended":false
          }
        ]
      }
    ]
  },
  {
    "text":"Supplies",
    "icon":"fa-shopping-cart",
    "alert":[
      {
        "name":"prince",
        "header":"Prince CD's going out of stock next week",
        "date":"Mon 26 April 2016 00:01",
        "icon":"fa-music",
        "active":true,
        "id":"stock1",
        "type":"stockout",
        "selected":false,
        "actions":[
          {
            "id":"prince_cd_stock_out",
            "subtext":"Action - 1",
            "text":"Get item from nearby store",
            "selected":false,
            "recomended":true
          },
          {
            "id":"clear_sky_action2",
            "subtext":"Action - 2",
            "text":"Put substitute items on shelf",
            "selected":false,
            "recomended":false
          },
          {
            "id":"clear_sky_action3",
            "subtext":"Action - 3",
            "text":"Send PO to nearby DC",
            "selected":false,
            "recomended":false
          }
        ]
      },
      {
        "name":"xbox",
        "header":"PS3 DVD's going out of stock next week",
        "date":"Mon 26 April 2016 00:01",
        "icon":"fa-gamepad",
        "active":true,
        "id":"stock2",
        "type":"stockout",
        "selected":false,
        "actions":[
          {
            "id":"prince_cd_stock_out",
            "subtext":"Action - 1",
            "text":"Get item from nearby store",
            "selected":false,
            "recomended":true
          },
          {
            "id":"prince_cd_stock_out2",
            "subtext":"Action - 2",
            "text":"Put substitute items on shelf",
            "selected":false,
            "recomended":false
          },
          {
            "id":"prince_cd_stock_out3",
            "subtext":"Action - 3",
            "text":"Send PO to nearby DC",
            "selected":false,
            "recomended":false
          }
        ]
      }
    ]
  },
  {
    "text":"Store",
    "icon":"fa-bullhorn",
    "alert":[
      {
        "name":"furnace",
        "header":"Furnace Filter Alert",
        "date":"Mon 26 April 2016 00:01",
        "icon":"fa-bullhorn",
        "active":true,
        "id":"furnace1",
        "type":"furnace",
        "selected":false,
        "actions":[
          {
            "id":"furnace_maintenance_1",
            "subtext":"Action - 1",
            "text":"Call HVAC Support: 888.498.0765",
            "selected":false,
            "recomended":true
          },
          {
            "id":"furnace_maintenance_1",
            "subtext":"Action - 2",
            "text":"Clean the filter",
            "selected":false,
            "recomended":false
          },
          {
            "id":"furnace_maintenance_3",
            "subtext":"Action - 3",
            "text":"Replace the filter",
            "selected":false,
            "recomended":false
          }
        ]
      },
      {
        "name":"ventilator",
        "header":"Ventilator Filter Alert",
        "date":"Mon 26 April 2016 00:01",
        "icon":"fa-bullhorn",
        "active":false,
        "id":"ventilator1",
        "type":"ventilator",
        "selected":false,
        "actions":[
          {
            "id":"ventilator_maintenance_1",
            "subtext":"Action - 1",
            "text":"Call HVAC Support: 888.498.0765",
            "selected":false,
            "recomended":true
          },
          {
            "id":"ventilator_maintenance_1",
            "subtext":"Action - 2",
            "text":"Clean the Ventilator filter",
            "selected":false,
            "recomended":false
          },
          {
            "id":"ventilator_maintenance_1",
            "subtext":"Action - 3",
            "text":"Replace the Ventilator filter",
            "selected":false,
            "recomended":false
          }
        ]
      },
      {
        "name":"uv",
        "header":"UV Lamp Alert",
        "date":"Mon 26 April 2016 00:01",
        "icon":"fa-bullhorn",
        "active":false,
        "id":"uv1",
        "type":"uv",
        "selected":false,
        "actions":[
          {
            "id":"uv_maintenance_1",
            "subtext":"Action - 2",
            "text":"Replace the UV Lamp",
            "selected":false,
            "recomended":true
          }
        ]
      }
    ]
  }
];

var criticalAlertsObjGlobal = [
  {
    "name":"snow",
    "header":"Heavy Snow Expected Tomorrow",
    "date":"Mon 26 April 2016 17:27",
    "icon":"fa-cloud",
    "active":true,
    "action":true,
    "actions":[
      {
        "subtext":"Action - 1",
        "text":"Switch On Only 70% of Lights",
        "selected":false
      },
      {
        "subtext":"Action - 2",
        "text":"Check Rain Coat, Hot Soup, Chicken and Beer on Shelf stock",
        "selected":false
      },
      {
        "subtext":"Action - 3",
        "text":"Adjust Humidifier on AC",
        "selected":false
      }
    ]
  },
  {
    "name":"prince",
    "header":"Metallica Concert in two days",
    "date":"Mon 26 April 2016 00:01",
    "icon":"fa-music",
    "active":false,
    "action":false,
    "actions":[
      {
        "subtext":"Action - 1",
        "text":"Get item from nearby store",
        "selected":false
      },
      {
        "subtext":"Action - 2",
        "text":"Put substitute items on shelf",
        "selected":false
      },
      {
        "subtext":"Action - 3",
        "text":"Send PO to nearby DC",
        "selected":false
      }
    ]
  },
  {
    "name":"uv",
    "header":"UV Lamp Alert",
    "date":"Mon 26 April 2016 17:27",
    "icon":"fa-bullhorn",
    "active":false,
    "action":true,
    "actions":[
      {
        "id":"uv_maintenance_1",
        "subtext":"Action - 2",
        "text":"Replace the UV Lamp",
        "selected":false,
        "recomended":true
      }

    ]
  }
];
