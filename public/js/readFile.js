
let play = document.getElementById("playButton");
play.onclick = function() {
    const selectedFile = document.getElementById('input').files[0];
    if (selectedFile) {
        console.log(selectedFile.name);
        let reader = new FileReader();
        reader.readAsText(selectedFile, "UTF-8");
        reader.onload = function (evt) {
            let promise = new Promise(function(resolve, reject) {
                let lines = evt.target.result.split("\n");
                let turn = lines[0].replace("\r", "");
                let positions = lines[1].replace("\r", "").split(",");
                let jsonOBJ = {"turn": turn, "positions": positions, "fName": selectedFile.name};
                localStorage.setItem("input", JSON.stringify(jsonOBJ));
            }).then(window.location = "Game/index.html");
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    } else {
        window.location = 'Game/index.html';
    }
};
