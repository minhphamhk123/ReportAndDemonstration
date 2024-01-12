import React from 'react';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.h1}>Đồ Án: Hệ Thống Báo Cáo Kiểm Định Chất Lượng Đào Tạo</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.h2}>Mô Tả</h2>
          <p>Repository này chứa mã nguồn và tài liệu liên quan đến hệ thống báo cáo kiểm định chất lượng đào tạo. Hệ thống này được phát triển bằng ReactJS để tạo giao diện người dùng hiện đại và MongoDB để lưu trữ dữ liệu kiểm định. Ngoài ra, hệ thống sử dụng Google Drive API và Google Docs API để tạo và quản lý minh chứng đào tạo.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Các Tính Năng Chính</h2>
          <ul className={styles.ul}>
            <li className={styles.li}>Quản lý Báo Cáo: Tạo, chỉnh sửa, và xem lại báo cáo kiểm định chất lượng đào tạo. Hệ thống hỗ trợ nhiều loại báo cáo và tự động cập nhật dữ liệu từ nguồn MongoDB.</li>
            <li className={styles.li}>Quản lý Minh Chứng: Liên kết và quản lý minh chứng đào tạo trên Google Drive. Minh chứng được tạo tự động và liên kết với báo cáo tương ứng.</li>
            <li className={styles.li}>Giao Diện Người Dùng Thân Thiện: Giao diện người dùng được thiết kế để đơn giản, dễ sử dụng và thân thiện với người dùng.</li>
            <li className={styles.li}>Tích Hợp Google API: Sử dụng Google Drive API và Google Docs API để tương tác với dữ liệu và tài liệu từ Google Drive và Google Docs.</li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.p}>&copy; 2024 Team Đồ Án cô Trinh</p>
      </footer>
    </div>
  );
}