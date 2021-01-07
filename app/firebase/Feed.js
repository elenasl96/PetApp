export default class Feed {

     title : string;
     text : string;


     constructor(title,text){
          this.title = title;
          this.text = text;
     }

     getTitle(){
       return title;
     }

     getText(){
       return text;
     }

     toFirestore() {
         return {
           title: this.title,
           text: this.text,
      };
     }

}