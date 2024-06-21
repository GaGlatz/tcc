import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reactotronRedux} from 'reactotron-redux';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // Define o AsyncStorage como handler
  .configure() // Configurações padrão
  .useReactNative() // Adiciona todos os plugins padrão do React Native
  .use(reactotronRedux()) // Adiciona o plugin do Redux
  .connect(); // Conecta ao Reactotron

// Extensão do console para facilitar o debug
console.tron = Reactotron;

// Exporta a instância configurada do Reactotron
export default reactotron;
