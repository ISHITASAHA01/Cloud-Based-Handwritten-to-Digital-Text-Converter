var text="";
var file="";
document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('previewImage').src = reader.result;
        document.getElementById('previewWrapper').style.display = 'flex';
    };
    reader.readAsDataURL(file);
});

function closePreview() {
    document.getElementById('previewWrapper').style.display = 'none';
}

//------------------------AWS Configuration----------------------------------------
AWS.config.update({
    accessKeyId: 'your acees key',
    secretAccessKey: 'your parivate key',
    region: 'your aws region'
});
const s3 = new AWS.S3();
const bucketName = 'storage-project-web';
//----------------------------------------------------------------------------------



  

async function uploadFile() {

    document.getElementById('imageInput').addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
      

      });

    file = document.getElementById('imageInput').files[0];
    if (!file) return alert("Please upload an image first.");

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Only JPG, JPEG, or PNG files are allowed.");
      this.value = ''; // Clear the invalid file
    }
    else{
    const obj = {
        Bucket: bucketName,
        Key: file.name,
        Body: file
    };

    try {
        await s3.upload(obj).promise();
        document.getElementById("outputText").textContent = "⏳ Loading...";
        
    } catch (error) {
        console.error(error);
        alert("This file is not supported.");
        return;
    }

    document.getElementById('progressBar').style.display = 'block';

    setTimeout(() => {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'flex';
        document.getElementById('progressBar').style.display = 'none';
    }, 3003);

    try {
        await sleep(4000);
        const txtFileName = file.name.replace(/\.[^/.]+$/, ".txt"); // convert image.jpg -> image.txt
        const fileUrl = "https://output-storage-project-web.s3.ap-south-1.amazonaws.com/" + txtFileName + `?t=${Date.now()}`;
        document.getElementById("outputText").textContent = "⏳ Loading...";
        const response = await fetch(fileUrl);
        let output = await response.text();
        document.getElementById("outputText").textContent = output;
        text=output;
        output="";
    } catch (error) {
        alert("❌ Failed to load file: ");
    }

    }
}

function downloadText(format, sampleText) {
    if (!sampleText.trim()) return alert("No text to download.");

    if (format === 'txt') {
        const blob = new Blob([sampleText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'converted_text.txt';
        link.click();
    } else if (format === 'pdf') {
        const doc = new window.jspdf.jsPDF();
        const lines = doc.splitTextToSize(sampleText, 180);
        doc.text(lines, 10, 10);
        doc.save('converted_text.pdf');
    }else if (format === 'jpg' || format === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const lines = sampleText.split('\n');
    
        // Set text properties first
        const fontSize = 18;
        const lineHeight = fontSize * 1.5;
        const padding = 40;
        ctx.font = `${fontSize}px sans-serif`;
    
        // Calculate the widest line
        const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        canvas.width = maxLineWidth + padding * 2;
        canvas.height = lines.length * lineHeight + padding * 2;
    
        // Background
        ctx.fillStyle = '#2c5364';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Draw text
        ctx.fillStyle = '#fff';
        ctx.font = `${fontSize}px sans-serif`;
    
        lines.forEach((line, i) => {
            ctx.fillText(line, padding, padding + (i + 1) * lineHeight - (lineHeight / 3));
        });
    
        // Create image and trigger download
        const imageFormat = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const imageURL = canvas.toDataURL(imageFormat);
    
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `output.${format}`;
        link.click();
    }
    

        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `converted_text.${format}`;
            link.click();
        }, `image/${format}`);
    }


function handleDownload() {

        const format = document.getElementById('downloadFormat').value;
        downloadText(format,text);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  let isSpeaking = false;
  function speakText() {
      if (isSpeaking) return;
      const text = document.getElementById('outputText').innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      isSpeaking = true;
      utterance.onend = () => {
          isSpeaking = false;
          showMessage('Speech stopped.');
      };
      utterance.onerror = (event) => {
          showMessage('Error speaking text: ' + event.error);
          isSpeaking = false;
      };
      speechSynthesis.speak(utterance);
      showMessage('Speaking text...');
  }
  
  function goBack() {
      document.getElementById('uploadSection').style.display = 'block';
      document.getElementById('resultSection').style.display = 'none';
      document.getElementById('imageInput').value = '';
      closePreview();
      if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
          isSpeaking = false;
      }
  }

  function copyText() {
    const text = document.getElementById("outputText").innerText;
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = text;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
    alert("✅ Text copied to clipboard!");
  }
  

  
  