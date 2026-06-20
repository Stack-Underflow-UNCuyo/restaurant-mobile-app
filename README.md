# Restaurant App

Full-stack restaurant management system centered around a mobile application built with React Native, designed for real-time restaurant operations.

The mobile app allows waiters to manage tables, handle orders, and process payments, while kitchen staff can track and update orders through a Kitchen Kanban Board, improving workflow and coordination.

Additionally, the system includes a Next.js dashboard for administration and a Spring Boot REST API that powers the entire platform.

### Menu and Tables
<p align="center">
  <img width="246" height="520" alt="Captura de pantalla 2026-06-16 154321" src="https://github.com/user-attachments/assets/6080f113-3453-4757-a684-16ac5e063f5a" />
  <img width="242" height="531" alt="Captura de pantalla 2026-06-16 154258" src="https://github.com/user-attachments/assets/44991b80-57db-4de8-821c-1459504efdc9" />
</p>

### Order Management Board

<p align="center">
  <img width="611" height="816" alt="Captura de pantalla 2026-06-16 154746" src="https://github.com/user-attachments/assets/fb59e978-30de-42ac-a91b-ef7a492ede56" />
</p>


### Dashboard

<p align="center">
  <img width="1918" height="884" alt="Captura de pantalla 2026-06-16 153707" src="https://github.com/user-attachments/assets/fd80f468-7795-41ab-83bc-060705617735" />
</p>

---

## Sub-projects

This is a monorepo with four sub-projects. See each folder's README for setup, tech stack, requirements and environment variables:

| Folder | Description | Stack |
| ------ | ----------- | ----- |
| [restaurant-server/](./restaurant-server) | REST API that powers the platform | Spring Boot · PostgreSQL · JWT |
| [mobile-app/](./mobile-app) | Waiter & kitchen mobile app | React Native · Expo |
| [dashboard/](./dashboard) | Admin dashboard | Next.js · Tailwind CSS |
| [carta-web/](./carta-web) | Public web menu (QR) | Next.js · Tailwind CSS |
