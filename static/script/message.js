$(()=>{
    $("textarea").on("keypress", 
        (e)=>{
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault()
                console.log("send", e.target.value)
            }
        })
    }
)
