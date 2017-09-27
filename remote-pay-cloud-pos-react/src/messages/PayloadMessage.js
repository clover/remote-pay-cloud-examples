export default class PayloadMessage {

    constructor(payloadClassName, messageType){
        if(payloadClassName.length < 1){
            this.payloadClassName = "PayloadMessage";
        }
        else{
            this.payloadClassName = payloadClassName;
        }
        this.messageType = messageType;
    }

    getPayload(){
        return {
            "messageType" : this.messageType,
            "payloadClassName" : this.payloadClassName
        };
    }
//    public final String payloadClassName;
//    public final MessageType messageType;
//    private static final Gson GSON;
//
//    static {
//    GsonBuilder builder = new GsonBuilder();
//    builder.registerTypeHierarchyAdapter(JSONifiable.class, new CloverJSONifiableTypeAdapter());
//    builder.registerTypeHierarchyAdapter(byte[].class, new ByteArrayToBase64TypeAdapter());
//    GSON = builder.create();
//}
//
//private static final JsonParser PARSER = new JsonParser();
//
//public PayloadMessage(String payloadClassName, MessageType messageType) {
//    if (payloadClassName == null || payloadClassName.isEmpty()) {
//        this.payloadClassName = "PayloadMessage";
//    } else {
//        this.payloadClassName = payloadClassName;
//    }
//    this.messageType = messageType;
//}
//
//public String toJsonString() {
//    return GSON.toJson(this, this.getClass());
//}
//
//@Override
//public String toString() {
//    return getClass().getSimpleName() + toJsonString();
//}
//
//public static PayloadMessage fromJsonString(String m) {
//    JsonElement je = PARSER.parse(m);
//    JsonObject jo = je.getAsJsonObject();
//    String payloadClassName = jo.get("payloadClassName").getAsString();
//    Class<? extends PayloadMessage> cls = null;
//    try {
//        cls = (Class<? extends PayloadMessage>)Class.forName("com.clover.remote.client.lib.example.model." + payloadClassName);
//    } catch (ClassNotFoundException e) {
//        e.printStackTrace();
//    }
//    return GSON.fromJson(jo, cls);
//}
//
}//CONVERSATION_payload: {"message":"Why did the Storm Trooper buy an iPhone?","messageType":"CONVERSATION_QUESTION","payloadClassName":"ConversationQuestionMessage"}