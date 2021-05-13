export default class Notification {

     constructor(title,text,timestamp){
          this.title = title;
          this.text = text;
          this.timestamp = timestamp;
     }

     getTitle(){
       return title;
     }

     getText(){
       return text;
     }

     getTimestamp(){
       return timestamp;
     }

     toFirestore() {
         return {
           title: this.title,
           text: this.text,
           timestamp: this.timestamp,
      };
     }

}