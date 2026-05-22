const NAV_BAR = document.getElementById('navBar');
const NAV_LIST = document.getElementById('navList');
const HERO_HEADER = document.getElementById('heroHeader');
const HAMBURGER_BTN = document.getElementById('hamburgerBtn');
const NAV_LINKS = Array.from( document.querySelectorAll('.nav__list-link'));
const SERVICE_BOXES = document.querySelectorAll('.service-card__box');
const ACTIVE_LINK_CLASS = 'active';
const BREAKPOINT = 576;

let currentServiceBG = null;
let currentActiveLink = document.querySelector('.nav__list-link.active');

// Remove the active state once the breakpoint is reached
const resetActiveState = ()=>{
  NAV_LIST.classList.remove('nav--active');
  Object.assign(NAV_LIST.style, {
    height: null
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
}

//Add padding to the header to make it visible because navbar has a fixed position.
const addPaddingToHeroHeaderFn = () => {
  const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
  const HEIGHT_IN_REM = NAV_BAR_HEIGHT / 10;

  // If hamburger button is active, do not add padding
  if (NAV_LIST.classList.contains('nav--active')) {
    return;
  }
  Object.assign(HERO_HEADER.style, {
    paddingTop: HEIGHT_IN_REM + 'rem'
  });
}
addPaddingToHeroHeaderFn();
window.addEventListener('resize', ()=>{
  addPaddingToHeroHeaderFn();

  // When the navbar is active and the window is being resized, remove the active state once the breakpoint is reached
  if(window.innerWidth >= BREAKPOINT){
    addPaddingToHeroHeaderFn();
    resetActiveState();
  }
});

// As the user scrolls, the active link should change based on the section currently displayed on the screen.
window.addEventListener('scroll', ()=>{
  const sections = document.querySelectorAll('#heroHeader, #services, #works, #contact');

  // Loop through sections and check if they are visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
    if (window.scrollY >= sectionTop - NAV_BAR_HEIGHT) {
      const ID = section.getAttribute('id');
      const LINK = NAV_LINKS.filter(link => {
        return link.href.includes('#'+ID);
      })[0];
      console.log(LINK);
      currentActiveLink.classList.remove(ACTIVE_LINK_CLASS);
      LINK.classList.add(ACTIVE_LINK_CLASS);
      currentActiveLink = LINK;
    }
  });
});

// Shows & hide navbar on smaller screen
HAMBURGER_BTN.addEventListener('click', ()=>{
  NAV_LIST.classList.toggle('nav--active');
  if (NAV_LIST.classList.contains('nav--active')) {
    Object.assign(document.body.style, {
      overflowY: 'hidden'
    });
    Object.assign(NAV_LIST.style, {
      height: '100vh'
    });
    return;
  }
  Object.assign(NAV_LIST.style, {
    height: 0
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
});

// When navbar link is clicked, reset the active state
NAV_LINKS.forEach(link => {
  link.addEventListener('click', ()=>{
    resetActiveState();
    link.blur();
  })
})

// Handles the hover animation on services section
SERVICE_BOXES.forEach(service => {
  const moveBG = (x, y) => {
    Object.assign(currentServiceBG.style, {
      left: x + 'px',
      top: y + 'px',
    })
  }
  service.addEventListener('mouseenter', (e) => {
    if (currentServiceBG === null) {
      currentServiceBG = service.querySelector('.service-card__bg');
    }
    moveBG(e.clientX, e.clientY);
  });
  service.addEventListener('mousemove', (e) => {
    const LEFT = e.clientX - service.getBoundingClientRect().left;
    const TOP = e.clientY - service.getBoundingClientRect().top;
    moveBG(LEFT, TOP);
  });
  service.addEventListener('mouseleave', () => {
    const IMG_POS = service.querySelector('.service-card__illustration')
    const LEFT = IMG_POS.offsetLeft + currentServiceBG.getBoundingClientRect().width;
    const TOP = IMG_POS.offsetTop + currentServiceBG.getBoundingClientRect().height;

    moveBG(LEFT, TOP);
    currentServiceBG = null;
  });
});

// Handles smooth scrolling
new SweetScroll({
  trigger: '.nav__list-link, .header__resume',
  easing: 'easeOutQuint',
  offset: NAV_BAR.getBoundingClientRect().height - 80
});

// Contact Form Validation & Handling
const CONTACT_FORM = document.querySelector('.contact__form');
const CONTACT_NAME_INPUT = document.getElementById('contactNameTxt');
const CONTACT_MSG_INPUT = document.getElementById('contactDescriptionTxt');
const SUBMIT_BTN = document.querySelector('.contact__submit-btn');

if (CONTACT_FORM) {
  CONTACT_FORM.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = CONTACT_NAME_INPUT.value.trim();
    const message = CONTACT_MSG_INPUT.value.trim();
    
    // Validation
    if (!name) {
      alert('Please enter your name.');
      CONTACT_NAME_INPUT.focus();
      return;
    }
    
    if (name.length < 2) {
      alert('Please enter a valid name (at least 2 characters).');
      CONTACT_NAME_INPUT.focus();
      return;
    }
    
    if (!message) {
      alert('Please enter your message.');
      CONTACT_MSG_INPUT.focus();
      return;
    }
    
    if (message.length < 10) {
      alert('Please enter a message with at least 10 characters.');
      CONTACT_MSG_INPUT.focus();
      return;
    }
    
    // Success message
    const originalBtnText = SUBMIT_BTN.textContent;
    SUBMIT_BTN.textContent = 'Message Sent! ✓';
    SUBMIT_BTN.style.backgroundColor = '#00FF94';
    SUBMIT_BTN.style.color = '#111';
    SUBMIT_BTN.disabled = true;
    
    // Reset form after 2 seconds
    setTimeout(() => {
      CONTACT_FORM.reset();
      SUBMIT_BTN.textContent = originalBtnText;
      SUBMIT_BTN.style.backgroundColor = '#64fcd9';
      SUBMIT_BTN.style.color = '#111';
      SUBMIT_BTN.disabled = false;
      alert('Thank you for reaching out! We will get back to you soon.');
    }, 2000);
  });
}
