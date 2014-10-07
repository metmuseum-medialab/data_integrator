data_integrator
===============

a platform for the read-write collections API

basic terms:
1. 'thing' - ie instance, object, etc
2. 'thing type' - eg class : ie. things have a type: eg "joe is a person."
3. widget - a piece of functionality that can be added to a thing
4. widget type - eg, the class of widget

primary interactions:
1. view and browse existing things
2. 'attach' a widget of your own to an individual thing, that others will be able to see
3. configure a widget to do special stuff.
3. 'attach' a default widget to all things of the same type
3. extract all the data from a thing in a computer-friendly format
4. create a widget definition that can do all sorts of stuff.
5. ability to add lots of basic sections via web interface. ie, a

things a widget might do:
1. run some computation on other data the thing has, and present it.
2. watch the things other data, and send a notice if it changes
3. provide a graphical widget for manipulating data, and saving it with the thing so other people can see it
4. call another webservice and display that data
5. be a text field

widgets can be:
- attached to individual things when available
- attached mutliply to the same thing, with different configurations (ie multiple widgets of teh same type)
- listed as "available widgets" for a type
- set up as 'default widgets' with specific configurations, applied to every thing of that type



code vs config:
- WidgetTypes are CODE
- individual widgets are CONFIG
- widgetTypes should be generic enough that you can do lots of different things depending on how you config it.
- so the config can go into an interface.

- a widget is an INSTANCE of a class, with data applied.
- all widgetType classes extend a common base class, Widget

- data in a widget is of two types:
-- configuration : what you need to know about the widget for it to run
-- data : all the other data it holds


WidgetType  - definition - static methods and properties on Widget class  
Widget - attached to a thing Type
WidgetInstance - attached to a thing.
ThingType
Thing



Other tools
- ElasticSearch is what I'm currently using to support search (using the inappropriately-name solw widget right now-- yikes!)
-- istalled the HEAD plugin for a elasticsearch frontend for now: http://localhost:9200/_plugin/head/
-- sudo bin/plugin -install mobz/elasticsearch-head from /usr/local/Cellar/elasticsearch/[version number]

