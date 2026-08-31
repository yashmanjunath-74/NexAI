import 'package:flutter_test/flutter_test.dart';
import 'package:nexai_student/main.dart';

void main() {
  testWidgets('NexAI Student smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NexAIStudentApp());
    expect(find.text('NexAI Student'), findsOneWidget);
  });
}
