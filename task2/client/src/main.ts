import './style.css'
import nexushubLogo from './assets/nexushub_logo.png'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center;">
  <div class="hero" style="margin-bottom: 2rem;">
    <img src="${nexushubLogo}" alt="NexusHub logo" style="width: 250px; height: 250px; border-radius: 50%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
  </div>
  <div>
    <h1 style="font-size: 3rem; background: -webkit-linear-gradient(45deg, #a78bfa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">Welcome to NexusHub</h1>
    <p style="font-size: 1.2rem; color: #6b7280; max-width: 600px; margin: 0 auto 2rem auto;">Experience the next generation of social connectivity. Beautiful, fast, and secure.</p>
  </div>
  <button id="counter" type="button" class="counter" style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); transition: all 0.2s ease;" onmouseover="this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.6)'" onmouseout="this.style.boxShadow='0 4px 15px rgba(99, 102, 241, 0.4)'"></button>
</section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

