import Swal from "sweetalert2";

export const showErrorMessageBox = (title, message) => {
  // Fire the sweet alert modal
  Swal.fire(title, message, "error");
}

export const showSuccessMessageBox = (title, message) => {
  // Fire the sweet alert modal
  Swal.fire(title, message, "success")
    .then(function () {
      // This function fires when clicking the OK button or clicking outside the modal
      // Reloads the page
      //window.location.reload();
      // Scrolls to the topafter reloading of page
      //window.scrollTo(0, 0);
    });
}

export const showWarningMessageBox = (title, message) => {
  // Fire the sweet alert modal
  Swal.fire(title, message, "warning");
}

export const openConfirmation = (title, message, icon, callback) => {
  // Fire the sweet alert modal using various options
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#2b8000",
    confirmButtonText: "Yes",
    cancelButtonText: "No"
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        await callback(true)
      }
      else {
        await callback(false);
      }
    });
}
