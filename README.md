* Getestet mit Versionen
    * node: v10.15.0,
    * npm: 6.4.1
    * cordova: 8.1.2

* Wie installieren? (Angenommen cordova, node, npm und git sind bereits installiert)
    * auschecken
    * führe aus: `cordova prepare`
    * führe aus: `npm install`
   
* Wie testet/führt man es aus?
    * führe aus: `cordova run <platform>` wo platform für `browser`, `android`
      oder `ios` steht. 
    * durch `cordova prepare browser` wird die Webseite neu gebuildet und der
      Server, welcher durch `cordova run browser` gestartet wurde, liefert
      die neu gebuildeten Daten aus