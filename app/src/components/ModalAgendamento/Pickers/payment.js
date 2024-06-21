// Refatoração do componente PaymentPicker para melhorar a legibilidade e manutenção

import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Box, Text, Touchable} from '../../../styles';
import theme from '../../../styles/theme.json';
import util from '../../../util';

const PaymentPicker = () => {
  return (
    <>
      <Text bold hasPadding color="dark">
        Como você gostaria de pagar?
      </Text>
      <View style={styles.container}>
        <Touchable
          height="30px"
          rounded="5px"
          background={util.toAlpha(theme.colors.muted, 5)}
          border={`0.5px solid ${util.toAlpha(theme.colors.muted, 40)}`}
          align="center"
          hasPadding
          justify="space-between"
          style={styles.touchable}>
          <Box direction="row" align="center">
            <Image
              source={{
                uri:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png',
              }}
              style={styles.image}
            />
            <Text small>4153 **** **** 0981</Text>
          </Box>
          <Icon name="cog-outline" color={theme.colors.muted} size={20} />
        </Touchable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 30,
    height: 10,
    marginRight: 10,
  },
});

export default PaymentPicker;
