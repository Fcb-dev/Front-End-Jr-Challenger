import React from 'react';
import * as Toast from '@radix-ui/react-toast';
import styles from './index.module.css';

interface ToasterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: 'error' | 'success';
  title: string;
  description: string;
}

export const Toaster: React.FC<ToasterProps> = ({ open, setOpen, type, title, description }) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={`${styles.ToastRoot} ${type === 'success' ? styles.Success : styles.Error}`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className={styles.ToastTitle}>{title}</Toast.Title>
        <Toast.Description className={styles.ToastDescription}>{description}</Toast.Description>
      </Toast.Root>
      <Toast.Viewport className={styles.ToastViewport} />
    </Toast.Provider>
  );
};