export default class Feed {

     title : string;
     text : string;
     type: string;


     constructor(title,text,type){
          this.title = title;
          this.text = text;
          this.type = type;
     }

     getTitle(){
       return this.title;
     }

     getText(){
       return this.text;
     }

     getType(){
       return this.type;
     }

     toFirestore() {
         return {
           title: this.title,
           text: this.text,
           type: this.type,
      };
     }

}