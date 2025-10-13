/**
 * Disable Developer Tools in Production
 * This utility provides comprehensive protection against inspect mode
 */

export const disableDevTools = () => {
  // Only run in production
  // if (import.meta.env.MODE !== 'production') {
  //   return;
  // }

  // 1. Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // F12 - DevTools
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I - DevTools
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C - Inspect Element
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U - View Source
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+S - Save Page
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });

  // 3. Disable text selection (optional - uncomment if needed)
  // document.addEventListener('selectstart', (e) => {
  //   e.preventDefault();
  //   return false;
  // });

  // 4. Disable copy (optional - uncomment if needed)
  // document.addEventListener('copy', (e) => {
  //   e.preventDefault();
  //   return false;
  // });

  // 5. Detect DevTools Opening
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      // DevTools detected - you can redirect or show warning
      console.clear();
      document.body.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️</h1>
          <h2 style="font-size: 32px; margin-bottom: 10px;">প্রবেশাধিকার অস্বীকৃত</h2>
          <p style="font-size: 18px; max-width: 600px;">
            এই পৃষ্ঠাটি সুরক্ষিত। ডেভেলপার টুলস ব্যবহার করার অনুমতি নেই।
          </p>
          <p style="font-size: 16px; margin-top: 20px; opacity: 0.8;">
            Access Denied - Developer Tools Not Allowed
          </p>
        </div>
      `;
    }
  };

  // Check every 500ms
  setInterval(detectDevTools, 500);

  // 6. Disable console methods
  if (window.console) {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
    console.table = noop;
    console.trace = noop;
    console.dir = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.clear = noop;
  }

  // 7. Detect debugger statement
  const detectDebugger = () => {
    const before = Date.now();
    debugger;
    const after = Date.now();
    if (after - before > 100) {
      // Debugger detected
      window.location.href = 'about:blank';
    }
  };

  // Run debugger detection periodically (can be aggressive)
  // Uncomment if you want extra protection
  // setInterval(detectDebugger, 1000);

  // 8. Prevent iframe embedding (clickjacking protection)
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }

  // 9. Clear console periodically
  setInterval(() => {
    console.clear();
  }, 1000);

  console.log('%cStop!', 'color: red; font-size: 60px; font-weight: bold;');
  console.log('%cThis is a browser feature intended for developers.', 'font-size: 20px;');
  console.log('%cIf someone told you to copy-paste something here, it is a scam.', 'font-size: 18px; color: red;');
};

// Export for use in main.jsx
export default disableDevTools;
