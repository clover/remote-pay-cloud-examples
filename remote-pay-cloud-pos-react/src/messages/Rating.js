//
//
//import android.os.Parcel;
//import android.os.Parcelable;
//
//import java.io.Serializable;

export default class Rating {

    constructor(){
        this.id = null;
        this.question = null;
        this.value = null;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getQuestion(){
        return this.question;
    }

    setQuestion(question){
        this.question = question;
    }

    getValue(){
        return this.value;
    }

    setValue(value){
        this.value = value;
    }

}