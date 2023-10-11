function updateLayout() {
    const windowWidth = window.innerWidth;
    const texting = document.querySelector('.texting');
    if ((windowWidth < 1400) && (windowWidth > 1300)) {
        
        texting.style.width = '750px';
        
    } else if ((windowWidth < 1300) && (windowWidth > 1200)) {
        texting.style.width = '650px';
    } else if ((windowWidth < 1200) && (windowWidth > 1000)) {
        texting.style.width = '450px';
    } else if (windowWidth < 1000) {
        texting.style.width = '350px';
    } else
    {
       
        texting.style.width = '1000px';
        
    }
}

window.addEventListener('resize', updateLayout);
window.addEventListener('load', updateLayout);