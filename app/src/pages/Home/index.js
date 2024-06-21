import React, {useEffect, useMemo} from 'react';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSalao, allServicos} from '../../store/modules/salao/actions';

import Header from '../../components/Header';
import Servico from '../../components/Servico';
import ModalAgendamento from '../../components/ModalAgendamento';

const Home = () => {
  const dispatch = useDispatch();
  const {servicos, form} = useSelector((state) => state.salao);

  const finalServicos = useMemo(() => {
    if (form.inputFiltro.length > 0) {
      const arrSearch = form.inputFiltro.toLowerCase().trim().split(' ');
      return servicos.filter((s) => {
        const titulo = s.titulo.toLowerCase().trim();
        return arrSearch.every((w) => titulo.includes(w));
      });
    }
    return servicos;
  }, [servicos, form.inputFiltro]);

  useEffect(() => {
    dispatch(getSalao());
    dispatch(allServicos());
  }, [dispatch]);

  return (
    <>
      <FlatList
        ListHeaderComponent={<Header />}
        data={finalServicos}
        renderItem={({item}) => <Servico item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{paddingBottom: 100}}
      />
      <ModalAgendamento />
    </>
  );
};

export default Home;
