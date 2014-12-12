data_integrator
===============

TODO
- "require serverside load" - a widgetType variable that says that for every page load, there should be a simultaneous backend load of the entity as well, so that all server-side stuff happens in one go. (eg, saving to elasticsearch and a graphdb shouldn't require two loads of the same node. But, the client-side needs to have awareness of when that work has completed. hmmmmm....


Next Widgets:
- a link-follower widget, so pages that generate lists of things (eg from searching another site), can call the individual thing pages, thereby populating them with content
- computer vision widget
- "comments" widget - embedded google doc?

Layout/UI stuff
- better use of space, smaller fonts, less whitespace
- a "hidden" tray for the housekeeping widgets, small icons to indicate that they are running

Refactoring:
- separate template/display from logic in a sensible way.

a platform for the read-write collections API

basic terms:
- 'thing' - ie instance, object, etc
- 'thing type' - eg class : ie. things have a type: eg "joe is a person."
- widget - a piece of functionality that can be added to a thing
- widget type - eg, the class of widget

primary interactions:
- view and browse existing things
- 'attach' a widget of your own to an individual thing, that others will be able to see
- configure a widget to do special stuff.
- 'attach' a default widget to all things of the same type
- extract all the data from a thing in a computer-friendly format
- create a widget definition that can do all sorts of stuff.
- ability to add lots of basic sections via web interface. ie, a

things a widget might do:
- run some computation on other data the thing has, and present it.
- watch the things other data, and send a notice if it changes
- provide a graphical widget for manipulating data, and saving it with the thing so other people can see it
- call another webservice and display that data
- be a text field

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

