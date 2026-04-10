module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'warn on plain HTTP urls'
    },
    schema: [],
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS'
    }
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.startsWith('http://')) {
          context.report({
            node,
            messageId: 'noHttpUrl',
            data: {
              url: node.value
            }
          });
        }
      }
    };
  }
};

