// src/utils/contact.js

// Simple fake contact handler: simulates async send and stores messages in localStorage
export async function sendMessage({ name, email, message }) {
  return new Promise((resolve, reject) => {
    if (!name || !email || !message) return reject(new Error('Missing fields'))
    // simulate network latency
    setTimeout(() => {
      try {
        const store = JSON.parse(localStorage.getItem('contact_messages') || '[]')
        store.push({ name, email, message, date: new Date().toISOString() })
        localStorage.setItem('contact_messages', JSON.stringify(store))
        resolve({ ok: true })
      } catch (e) {
        reject(e)
      }
    }, 700)
  })
}
