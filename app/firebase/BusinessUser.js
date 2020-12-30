import User from './User.js';
export default class BusinessUser extends User{

   pid : string;
   news : {}; //dict: key is the timestamp of the news and value is text of the news + title

   constructor(name, photo, type, address,pid,news) {
       super(name, photo, type, address);
       this.pid = pid;
       this.news = news;

   }

   getPid(){
     return pid;
   }

   getNews(){
     return news;
   }

   toFirestore() {
       return {
         name: this.name,
         photo: this.photo,
         type: this.type,
         address: this.address,
         pid: this.pid,
         news: this.news,
       };
   }
}