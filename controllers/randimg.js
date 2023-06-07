  window.onload = setRandomImage;
  function setRandomImage(){
    let text = 'Anime-Images API'
    let i = 0;
    let type = () => {
    if (i < text.length){
    document.getElementById('t').innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 50)
  }
}
    type()
    let num = Math.floor(Math.random() * 6)
    let arr = ['rias', 'koneko', 'akeno', 'asia', 'xenovia', 'irina']
    document.getElementById('randimage').src = `http://localhost:5000/images/${arr[num]}.png`;
  };
