module.exports = {
  hourToMinutes: (time) => {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  },

  formatTelefone: (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length === 11) {
      return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(
        2,
        7
      )}-${digitsOnly.slice(7)}`;
    }

    return phone;
  },
};
