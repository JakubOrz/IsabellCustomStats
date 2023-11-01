const urlSearchParams = new URLSearchParams(window.location.search);
const eventId = Object.fromEntries(urlSearchParams.entries()).eventId;

function onLoad(){
    const header = document.getElementById("botname")
    const statsTextForm = document.getElementById("statsArea")
    const submitButton = document.getElementById("submitStatsButton");
    const submitResult = document.getElementById("submitResult");

    submitResult.hidden = true
    if (eventId === undefined){

        statsTextForm.disabled = true
        header.innerText = "Nie wskazano linku do eventu"
        submitButton.disabled = true;
        return;
    }

    fetch("https://ladyisabell3-1-z4708130.deta.app/submitter/getBotInfo/".concat(eventId))
        .then(res => res.json())
        .then(response => {
            header.innerText = "FS organizator - ".concat(response["data"])
            submitButton.disabled = !response["success"];
        });
}

function onStatsSend(event){
    event.preventDefault();
    let submitButton = document.getElementById("submitStatsButton");
    submitButton.disabled = true;
    const dataToSend = JSON.stringify(
        {"agentId": 170, "botId": eventId, "data": statsArea.value.split("\n")}
    );

    fetch("https://ladyisabell3-1-z4708130.deta.app/submitter/submitStats", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: dataToSend
    })
        .then(resp => {
            if (resp.status === 200) {
                return resp.json()
            } else {
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            console.log(dataJson)
            document.getElementById("helptext").innerText = dataJson["data"];
            if (dataJson["success"] === true){
                document.getElementById("statsArea").value = '';
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })

    submitButton.disabled = false;

}

function clearInputs(){
    document.getElementById("statsArea").value = '';
}