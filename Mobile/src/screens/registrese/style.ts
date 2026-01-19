import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND_BODY,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.SPACING.PADDING_PAGE,
  },
  card: {
    backgroundColor: THEME.COLORS.BACKGROUND_CARD,
    width: '100%',
    maxWidth: 380,
    padding: 30,
    borderRadius: THEME.SPACING.RADIUS_CARD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: THEME.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 14,
  },
  button: {
    backgroundColor: THEME.COLORS.PRIMARY,
    padding: 15,
    borderRadius: THEME.SPACING.RADIUS_BUTTON,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: THEME.COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
