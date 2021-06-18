import { SchemaDirectiveVisitor } from 'apollo-server-express'

class HideDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.resolve = async () => 'This is secret!'
  }
  visitArgumentDefinition(argument) {
    argument.resolve = async () => 'This is secret!'
  }
  visitInputFieldDefinition(field) {
    field.resolve = async () => 'This is secret!'
  }
}

export default HideDirective
