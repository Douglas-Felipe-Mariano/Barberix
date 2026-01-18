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
    // Sombra para dar profundidade ao card
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.COLORS.BACKGROUND_INPUT,
    color: THEME.COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
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
  },
  errorBox: {
    backgroundColor: 'rgba(231,76,60,0.08)',
    borderWidth: 1,
    borderColor: THEME.COLORS.DANGER,
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  errorText: {
    color: THEME.COLORS.DANGER,
    textAlign: 'center',
    fontSize: 14,
  }
});