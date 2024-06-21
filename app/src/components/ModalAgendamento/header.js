import React from 'react';
import {View, Dimensions} from 'react-native';
import {Touchable, GradientView, Text, Spacer, Box} from '../../styles';
import theme from '../../styles/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalHeader = ({onPress = () => {}, form}) => {
  const isFinalStep = form.modalAgendamento === 2;
  const screenWidth = Dimensions.get('screen').width;

  const ChevronIcon = ({name}) => (
    <Icon name={name} color={theme.colors.light} size={30} />
  );

  return (
    <View style={{width: '100%', height: 70}}>
      <GradientView
        colors={[theme.colors.dark, theme.colors.primary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Box>
          <Touchable
            onPress={onPress}
            width={screenWidth}
            justify={isFinalStep ? 'flex-start' : 'space-between'}
            hasPadding>
            {isFinalStep && (
              <View style={{marginRight: 20}}>
                <ChevronIcon name="chevron-left" />
              </View>
            )}
            <View>
              <Text bold color="light" small>
                Finalizar Agendamento
              </Text>
              <Spacer size="4px" />
              <Text color="light" small>
                Horário, pagamento e especialista.
              </Text>
            </View>
            {!isFinalStep && (
              <View>
                <ChevronIcon name="chevron-right" />
              </View>
            )}
          </Touchable>
        </Box>
      </GradientView>
    </View>
  );
};

export default ModalHeader;
