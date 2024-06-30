# Medichat FE

Medichat is a comprehensive healthcare platform designed to facilitate the buying and selling of medicines and provide telemedicine services with doctors. This repository contains the Next.js frontend codebase for Medichat. The frontend is developed using TypeScript, Chakra UI, and Tailwind CSS.

## Features

- **Buying and Selling Medicines**: Users can purchase medicines through the platform.
- **Telemedicine**: Users can consult with doctors via chat for medical advice and prescriptions.

## Roles

### Admin
- Confirm user payments before orders are sent to the pharmacy manager.
- Create new pharmacy managers.

### Doctor
- Provide telemedicine consultations via chat.
- Issue prescriptions and medical certificates.

### Pharmacy Manager
- Create and manage pharmacies.
- Add new products (medicines) to the inventory.
- Transfer medicine stock between pharmacies.
- Confirm user orders.

### User
- Participate in telemedicine consultations.
- Buy medicines through the platform.

## Functionality

- **Doctor Availability**: Doctors can set their profile to online or offline manually, indicating their availability for telemedicine consultations.
- **Telemedicine Consultation Time**: Each telemedicine consultation has a maximum duration of 30 minutes. After 30 minutes, the chat session is automatically closed.
- **Customized Prescriptions and Certificates**: Doctors can send customized prescriptions and medical certificates through the platform.
- **Chat History**: Both doctors and users can view the history of their telemedicine chats.
- **Order Cancellation**: Users can cancel their orders if the payment has not yet been confirmed by an admin.
- **Medicine Stock Transfer**: Pharmacy managers can transfer medicine stock from one pharmacy to another within the platform.
- **Prescription Attachment**: Users can attach prescriptions for restricted medicines (Obat Keras) when placing an order.
- **Location-Based Medicine Availability**: Users are shown medicines available within a 25km radius from their address by default. They can still search for any medicine via a search bar, even if it's not available in their area (though they cannot buy it if it's not available locally).

## Getting Started
To get started with Medichat, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/kesyafebriana/medichat-fe.git
    ```
2. Navigate to the project directory:
    ```bash
    cd medichat-fe
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Copy the example environment file and update it with your configuration:
    ```bash
    cp .env.example .env
    ```
5. Run the development server:
    ```bash
    npm run dev
    ```

## Team
- Kesya Febriana Manampiring (me)
- Muhammad Naufal Fakhrizal
- Muhammad Hafizh Roihan
- Owen Susanto
- Muhammad Daud