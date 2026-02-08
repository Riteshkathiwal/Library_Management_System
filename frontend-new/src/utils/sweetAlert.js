import Swal from 'sweetalert2';

export const confirmDelete = async (title = 'Are you sure?', text = 'You won\'t be able to revert this!') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC3545',
    cancelButtonColor: '#6C757D',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  return result.isConfirmed;
};

export const confirmAction = async (title, text, confirmText = 'Yes, proceed!') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4A90E2',
    cancelButtonColor: '#6C757D',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
  });

  return result.isConfirmed;
};

export const showSuccess = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#28A745',
  });
};

export const showError = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#DC3545',
  });
};

export default {
  confirmDelete,
  confirmAction,
  showSuccess,
  showError,
};
