// async function loadCards(classId) {
//     let response = await fetch("/posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ classId }), 
//     });
//     let data = await response.json();
//     const container = document.querySelector(".tweets");
//     container.innerHTML = '';

//     if (data.success) {
//         document.querySelector(".post").style.visibility = "visible";  
//         document.querySelector(".postbox").dataset.id = classId;
//     } else {
//         document.querySelector(".post").style.visibility = "hidden";
//     }

//     if (data.posts.length == 0) {
//         container.innerText = "NO POSTS";
//     }

//     const formatDate = (date) => {
//         const options = {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//         };
//         return new Date(date).toLocaleString('en-US', options);
//     };

//     data.posts.forEach(record => {
//         const card = document.createElement('div');
//         card.classList.add('tweet');
//         const formattedDate = formatDate(record.postedAt);

//         card.innerHTML = `
//             <div class="header">
//                 <img src="/prof.svg" width="35px" height="35px" alt="">
//                 <div class="headdetails">
//                     <p><h3>${record.author.name}</h3></p>
//                     <p>${formattedDate}</p>
//                 </div>
//             </div>
//             <div class="line"></div>
//             <div class="content">${record.content}</div>`
//         ;

//         if (record.media !== null) {
//             const media = record.media;
//             const divu = document.createElement('div');
//             divu.classList.add("mediabox");
//             divu.style.display = "flex";
//             for (const item of media) {
//                 const med = document.createElement('div');
//                 med.classList.add('media');
//                 med.innerText = item;
//                 divu.appendChild(med);
//             }
//             card.appendChild(divu);
//         }

//         container.appendChild(card);
//     });
// }
async function loadCards(classId) {
    let response = await fetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId }), 
    });
    let data = await response.json();
    const container = document.querySelector(".tweets");
    container.innerHTML = '';

    if (data.success) {
        document.querySelector(".post").style.visibility = "visible";  
        document.querySelector(".postbox").dataset.id = classId;
    } else {
        document.querySelector(".post").style.visibility = "hidden";
    }

    if (data.posts.length == 0) {
        container.innerText = "NO POSTS";
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    data.posts.forEach(record => {
        const card = document.createElement('div');
        card.classList.add('tweet');
        const formattedDate = formatDate(record.postedAt);

        card.innerHTML = `
            <div class="header">
                <img src="/prof.svg" width="35px" height="35px" alt="">
                <div class="headdetails">
                    <p><h3>${record.author.name}</h3></p>
                    <p>${formattedDate}</p>
                </div>
            </div>
            <div class="line"></div>
            <div class="content">${record.content}</div>
        `;

        if (record.media ) {
            const divu = document.createElement('div');
            divu.classList.add("mediabox");
            divu.style.display = "flex";

            record.media.newFilename.forEach((filename, index) => {
                const originalName = record.media.originalFilename[index] || "PDF File";
                const med = document.createElement('div');
                med.classList.add('media');
                med.innerHTML = `<a href="gemm2.html?pdf=${encodeURIComponent("/uploads/" + filename)}" target="_blank">📄 ${originalName}</a>`;

                divu.appendChild(med);
            }); 

            card.appendChild(divu);
        }

        container.appendChild(card);
    });
}

async function loadClasses(){
    let response = await fetch('/classes');
    let data = await response.json();
    console.log(data)
    const container = document.querySelector(".listup");
    container.innerHTML = '';
    console.log(data)
    if(data.length==0){
        container.innerText="NO CLASS"
        return;
    }
    let nums=0;
    data.forEach(record =>{
        nums++;
        if(nums>3){
            nums=1;
        }
        const card = document.createElement('div');
        const cardinner = document.createElement('div');
        console.log(record, record.classId)
        card.setAttribute("data-id", record.classId);
        card.classList.add('card');
        cardinner.classList.add('card-inner');
        const cardfront = document.createElement('div');
        cardfront.classList.add('card-front');
        const cardback = document.createElement('div');
        cardback.classList.add('card-back');
        cardfront.innerHTML = `<img src="/banner${nums}.jpg" height="72px" alt=""><div class="detail" ><h3 style=" position: absolute;bottom: 80px; left: 150px;">${record.classname}</h3><p>Created by: ${record.creatorName}</p></div>`;
        cardback.innerHTML = `<div><p>Classcode: ${record.classcode}</p></div>`;
        card.addEventListener("click",()=>{
            loadCards(record.classId);
        })
        card.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            card.classList.toggle("flip");
        });
        cardinner.appendChild(cardfront);
        cardinner.appendChild(cardback);
        card.appendChild(cardinner);

        container.appendChild(card);
    })
    
    } 


// async function captureFormData(event) {
//     event.preventDefault(); 

//     const form = document.getElementById('myform');
//     const formData = new FormData(form);
//     const formDetails = {};
//     if(document.querySelector(".tweets").innerText=="NO POSTS"){
//         document.querySelector(".tweets").innerText=''
//     }
//     formData.forEach((value, key) => {
//         if (key === 'files' && value instanceof File) {
//             formDetails[key] = {
//                 name: value.name,
//                 size: value.size,
//                 type: value.type
//             };
//         } else { 
//             formDetails[key] = value;
//         }
//     });
//     await fetch("/postit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formDetails),
//     });
//     console.log(JSON.stringify(formDetails, null, 2));

//     // Hide the post box
//     document.querySelector(".poste").style.display = "none";
//     loadCards();
//     // Add new card to the feed
    
//     // const newCard = document.createElement('div');
//     // newCard.classList.add('tweet'); 
//     // newCard.innerText = formDetails["description"]; 
//     // document.querySelector(".tweets").appendChild(newCard);

//     return false; // Prevent the form from submitting
// }
// async function captureFormData(event) {
//     event.preventDefault();

//     const form = document.getElementById('myform');
//     const formData = new FormData(form);

//     const content = formData.get('content'); 
//     const fileInput = document.querySelector('input[name="media"]');  
//     const media = fileInput.files.length > 0 ? fileInput.files[0].name : null; 

//     const formDetails = { content, media }; 
//     const classID=document.querySelector(".postbox").dataset.id;
//     const requestData = new FormData();
//     requestData.append("details", JSON.stringify(formDetails)); 
//     requestData.append("classId", classID);
//     for (let i = 0; i < files.length; i++) {
//         requestData.append("media", files[i]);
//     }
//     await fetch("/postit", {
//         method: "POST",
//         body: requestData, 
//     });

//     console.log("Form submitted:", formDetails);

//     document.querySelector(".poste").style.display = "none";
//     loadCards(classID);
// }
// async function captureFormData(event) { ORIGINAL
//     event.preventDefault();

//     const form = document.getElementById('myform');
//     const formData = new FormData(form);

//     const content = formData.get('content'); 
//     const fileInput = document.querySelector('input[name="media"]');  
//     let media = null;

//     if (fileInput && fileInput.files.length > 0) {
//         media = fileInput.files[0].name;
//     }

//     const formDetails = { content, media }; 
//     const classID = document.querySelector(".postbox").dataset.id;

//     await fetch("/postit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ details: formDetails, classId: classID }),
//     });

//     console.log("Form submitted:", formDetails);

//     document.querySelector(".poste").style.display = "none";
//     loadCards(classID);
// }
// async function captureFormData(event) {
//     event.preventDefault();
  
//     const form = document.getElementById('myform');
//     const formData = new FormData(form);
  
//     const content = formData.get('content'); 
//     const fileInput = document.querySelector('input[name="media"]');  
//     const media = fileInput.files.length > 0 ? fileInput.files[0] : null; 
  
//     const formDetails = { content }; 
//     const classID = document.querySelector(".postbox").dataset.id;
    
//     const requestData = new FormData();
//     requestData.append("details", JSON.stringify(formDetails)); 
//     requestData.append("classId", classID);
//     if (media) {
//       requestData.append("media", media); 
//     }
  
//     await fetch("/postit", {
//       method: "POST",
//       body: requestData, 
//     });
  
//     console.log("Form submitted:", formDetails);
//     document.querySelector(".poste").style.display = "none";
//     loadCards(classID);
//   }









// async function captureFormData(event) {
//     event.preventDefault();

//     const form = document.getElementById('myform');
//     const formData = new FormData(form);

//     const content = formData.get('content'); 
//     const fileInput = document.getElementById('fileInput');  
//     let media = [];

//     if (fileInput && fileInput.files.length > 0) {
//                 media = fileInput.files[0].name;
//             }
        

//     const formDetails = { content, media }; 
//     const classID = document.querySelector(".postbox").dataset.id;
//     console.log(classID)

//     const requestData = new FormData();
//     requestData.append("details", JSON.stringify(formDetails));
//     requestData.append("classId", classID);
//     for (let i = 0; i < fileInput.files.length; i++) {
//         requestData.append("media", fileInput.files[i]);
//     }

//     await fetch("/postit", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json", 
//         },
//         body: JSON.stringify({ details: formDetails, classId: classID }),
//     });
//     console.log("Form submitted:", formDetails);

//     document.querySelector(".poste").style.display = "none";
//     loadCards(classID);
// }

async function captureFormData(event) {
    event.preventDefault();

    const form = document.getElementById('myform');
    const formData = new FormData(form);

    const content = formData.get('content'); 
    const fileInput = document.getElementById('fileInput');  
    const classID = document.querySelector(".postbox").dataset.id;

    const requestData = new FormData();
    requestData.append("content", content);
    requestData.append("classId", classID);

    if (fileInput && fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            requestData.append("media", fileInput.files[i]);  
        }
    }

    await fetch("/postit", {
        method: "POST",
        body: requestData, 
    });

    console.log("Form submitted successfully!");

    document.querySelector(".poste").style.display = "none";
    loadCards(classID);
}


loadClasses();
document.querySelector(".post").addEventListener("click", () => {
    if( document.querySelector(".postbox").style.visibility == "visible"){
        document.querySelector(".postbox").style.visibility = "hidden";
        document.querySelector(".caption").value=""
    }
    else{
    document.querySelector(".postbox").style.visibility = "visible";
    document.querySelector(".poste").style.display = "block";}

});
document.getElementById("fileInput").addEventListener("change", function() {
    let fileName = this.files.length > 0 ? this.files[0].name : "Choose a file";
    document.getElementById("file-name").textContent = fileName;
});
function showCreateBox() {
    if(document.getElementById("createBox").style.display == "block"){
        document.getElementById("createBox").style.display = "none";
    }
    else{
    document.getElementById("createBox").style.display = "block";}
    document.getElementById("joinBox").style.display = "none";
}

function showJoinBox() {
    if(document.getElementById("joinBox").style.display == "block"){
        document.getElementById("joinBox").style.display = "none";
    }
    else{
    document.getElementById("joinBox").style.display = "block";}
    document.getElementById("createBox").style.display = "none";
}

async function createClass() {
    let className = document.getElementById("className").value;
    if (className.trim() !== "") {
        try {
            let response = await fetch("/createClasses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ className })
            });

            let result = await response.json();

            if (response.ok) {
                alert("Class '" + className + "' created!");
                document.getElementById("createBox").style.display = "none";
                document.getElementById("className").value = "";
            } else {
                alert("Error: " + result.error);
            }
            loadClasses()

        } catch (error) {
            alert("Failed to create class. Please try again.");
        }
    } else {
        alert("Please enter a class name.");
    }
}


async function joinClass() {
    let classCode = document.getElementById("classCode").value;
    if (classCode.trim() !== "") {
        try {
            let response = await fetch("/joinClasses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ classCode }) 
            });

            let result = await response.json();

            if (response.ok) {
                alert("Joined class with code: " + classCode);
                document.getElementById("joinBox").style.display = "none";
                document.getElementById("classCode").value = "";
                loadClasses()
            } else {
                alert("Error: " + result.error);
            }

        } catch (error) {
            alert("Failed to join class. Please try again.");
        }
    } else {
        alert("Please enter a class code.");
    }
}
