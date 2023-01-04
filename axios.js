var upload_form = document.getElementById("upload_form");
const formData = new FormData();
const __success = document.getElementById("__success");
const __err = document.getElementById("__err");
const __uw = document.getElementById("__uw");
const output = document.getElementById("listing");
const upload_progress = document.getElementById("upload_progress");
const __prog_ct = document.getElementById("__prog_ct");
const __prog = document.getElementById("__prog");
const axios_config = {
    onUploadProgress: (event) => {
        __prog_ct.style.display = "block";
        upload_progress.style.display = "block";
        let __cp =  Math.round((event.loaded * 100) / event.total)
        upload_progress.innerHTML = __cp + "%";
        __prog.style.width = __cp+"%";
    }
}
document.getElementById("folder").addEventListener("change", (event) => {
    output.innerHTML = "";
    __prog.style.width = "0%";
    __success.style.display = "none";
    __err.style.display = "none";
    let files = event.target.files
    for (const file of files) {
        // let item = document.createElement("li");
        // item.textContent = file.webkitRelativePath;
        // var pf = get_file_path_and_name(file.webkitRelativePath)
        // console.log(pf)
        formData.append(file.webkitRelativePath, file)
        // output.appendChild(item);
    };
    postFiles(formData)
    // console.log(files);
}, false);

// function get_file_path_and_name(file){
//     const lastIndex = file.lastIndexOf('/');
//     const path = file.slice(0, lastIndex);
    
//     const name = file.slice(lastIndex + 1);
//     return {
//         "path" : path,
//         "name" : name
//     }
// }
function postFiles(data)
{
    console.log(data);
    axios.post("http://localhost:8080/projects/upload",data, axios_config)
    .then(response => {
        output.innerHTML = "";
        __success.style.display = "block";
        let url = "ipfs://" + response.data.cid
        __uw.href = url
        __uw.innerHTML = url
    })
    .catch(error =>{
        console.log("Ye to samasya h re baba");
        console.error(error);
        __err.style.display = "block";
    })
    .finally( () => {
        __prog_ct.style.display = "none";
        upload_progress.style.display = "none"
    })
}

axios.get('http://localhost:8080/')
.then(response =>{
    console.log(response);
})
.catch(error => {
    console.log(error);
})