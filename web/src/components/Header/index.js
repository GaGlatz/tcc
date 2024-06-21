const Header = () => {
  const imageUrl =
    "https://sousecretaria.com.br/wp-content/uploads/2021/06/Estrutura-de-um-TCC-1024x512.jpg";

  return (
    <header class="container-fluid d-flex justify-content-end">
      <div class="d-flex align-items-center">
        <div class="text-right mr-3">
          <span class="d-block m-0 p-0 text-white">TCC Salon</span>
        </div>
        <img src={imageUrl} alt="Profile" />
        <span class="mdi mdi-chevron-down"></span>
      </div>
    </header>
  );
};

export default Header;
