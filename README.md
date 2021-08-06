# DiscordBot


# Commands:
Befehle vom Bot

## help
!help

* listet alle Befehle vom Bot auf

## ping
!ping
* pingt den Bot und gibt die latenz zurück

## homework / hw 

!homework [ add | list | delete | in-time ]

* add
  * Hausaufgaben hinzufügen
* list
  * listet alle Hausaufgaben
* delete [ all | (nummer der Hausaufgabe) ] (Administrator only)
  * löscht alle oder die jenige Hausaufgabe 
* in-time
  * startet manuell die Überprüfung ob Hausaufgaben abgelaufen sind
  * automatisch alle 5h  

## ignore (Administrator only)

!ignore channel  [ add | list | remove ] (channel)

* add (channel)
  * fügt einen Kannal hinzu der von dem Bot ignoriert werden soll
* list
  * listet alle Kanäle auf die vom Bot ignoriert werden
* remove (channel)
  * löscht den Kanal von der Liste der Kanäle die vom Bot ignoriert werden

Alle Kanäle in der 'ignore list' werden vom Bot ignoriert.

## clear
!clear ( zahl 1 bis 100 )

* löscht die anzahl der Nachrichten im Kanal
* es können maximal 100 Nachrichten aufeinmal gelöscht werden

