export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  status: 'success' | 'error';
  message?: string;
}

export function sendContactForm(_formData: ContactFormData): Promise<ContactResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve({ status: 'success' });
      } else {
        reject({ status: 'error', message: 'Send failed' });
      }
    }, 1000 + Math.random() * 1000);
  });
}
