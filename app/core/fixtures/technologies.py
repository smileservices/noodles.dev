from technology.serializers import TechnologySerializer
from category.models import Category
from technology.models import Technology
from users.models import CustomUser
from random import choice, choices

# use technology serializer to save

def make_technologies_and_categories():
    users = CustomUser.objects.all()
    categories = {}
    categories['programming_language'] = Category.objects.create(
        name='Programming Language',
        description='A programming language is a formal language comprising'
                    ' a set of instructions that produce various kinds of output.'
                    ' Programming languages are used in computer programming'
                    ' to implement algorithms.'
    )
    categories['frontend'] = Category.objects.create(name='Web Development - Frontend')
    categories['backend'] = Category.objects.create(name='Web Development - Backend')
    categories['web_backend_framework'] = Category.objects.create(name='Web Development Frameworks - Backend')
    categories['databases'] = Category.objects.create(name='Databases')
    categories['algorithms'] = Category.objects.create(name='Linux')
    categories['devops'] = Category.objects.create(name='Dev Ops')

    PUBLIC_DOMAIN = (0, 'Public Domain')
    PERMISSIVE_LICENSE = (1, 'Permissive License')
    COPYLEFT = (2, 'Copyleft')
    NONCOMMERCIAL = (3, 'Non Commercial')
    PROPRIETARY = (4, 'Proprietary')
    TRADE_SECRET = (5, 'Trade Secret')

    javascript = {
        "name": 'Javascript',
        "image_url": 'https://www.postscapes.com/wp-content/uploads/bb-plugin/cache/MST8CKVShX8cHwVIZ_FUR42xQZAEpUOLiHTsWrcG0o-SKEjCIq1KhCGHshgxTlTJ0CaHlJpBZ3pbT7zlyRQyq-dzFosiw-circle.jpeg',
        "category": categories['programming_language'].pk,
        "description": "Often abbreviated as JS, is a programming language that conforms to the ECMAScript specification."
                       " JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax,"
                       " dynamic typing, prototype-based object-orientation, and first-class functions.\n"
                       " Alongside HTML and CSS, JavaScript is one of the core technologies of the World Wide Web."
                       " JavaScript enables interactive web pages and is an essential part of web applications. The vast "
                       "majority of websites use it for client-side page behavior,[11] and all major web browsers have a dedicated"
                       " JavaScript engine to execute it.\n As a multi-paradigm language, JavaScript supports event-driven, "
                       "functional, and imperative programming styles. It has application programming interfaces (APIs) for working with text,"
                       " dates, regular expressions, standard data structures, and the Document Object Model (DOM).\n The ECMAScript standard"
                       " does not include any input/output (I/O), such as networking, storage, or graphics facilities. In practice, the web browser"
                       " or other runtime system provides JavaScript APIs for I/O.\n JavaScript engines were originally used only in"
                       " web browsers, but they are now core components of other runtime systems, such as Node.js and Deno. These systems "
                       "are used to build servers and are also integrated into frameworks, such as Electron and Cordova, for creating a variety"
                       " of applications.\n Although there are similarities between JavaScript and Java, including language name, "
                       "syntax, and respective standard libraries, the two languages are distinct and differ greatly in design.",
        "url": 'https://en.wikipedia.org/wiki/JavaScript',
        "license": PUBLIC_DOMAIN[0],
        "owner": 'European Computer Manufacturers Association',
        "pros": 'speed, simplicity, wide support on all browsers, asynchronous support',
        "cons": 'interpreted language, has its share of quirks',
        "limitations": 'Client-side JavaScript does not allow the reading or writing of files. It has been kept for the security reason.\n'
                       'No support for networking\n'
                       'No support for multithreading or multiprocessor capabilities',
        "featured": True,
        "ecosystem": False,
    }
    python = {
        "featured": True,
        "name": 'Python',
        "image_url": 'https://www.freepngimg.com/thumb/android/72537-icons-python-programming-computer-social-tutorial.png',
        "category": categories['programming_language'].pk,
        "description": "Python is an interpreted, high-level and general-purpose programming language. "
                       "Python's design philosophy emphasizes code readability with its notable use of significant "
                       "indentation.\n Its language constructs and object-oriented approach aim to help programmers"
                       " write clear, logical code for small and large-scale projects. Python is dynamically-typed"
                       " and garbage-collected.\n It supports multiple programming paradigms, including structured "
                       "(particularly, procedural), object-oriented and functional programming. Python is often "
                       "described as a \"batteries included\" language due to its comprehensive standard library.",
        "url": 'https://www.python.org/',
        "license": PUBLIC_DOMAIN[0],
        "owner": 'Python Software Foundation',
        "pros": 'speed of development, huge ecosystem of libraries, versatility, has multiprocessor capabilities',
        "cons": 'interpreted language',
        "limitations": 'multithreading: only one thread can access Python internals at a time',
        "ecosystem": False,
    }
    php = {
        "featured": True,
        "name": 'Php',
        "image_url": 'https://www.lije-creative.com/wp-content/uploads/2015/03/php7.jpeg',
        "category": categories['programming_language'].pk,
        "description": "PHP is a general-purpose scripting language especially suited to web development."
                       " It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1994.\n"
                       " The PHP reference implementation is now produced by The PHP Group. "
                       "PHP originally stood for Personal Home Page, but it now stands for the "
                       "recursive initialism PHP: Hypertext Preprocessor",
        "url": 'https://www.php.net/',
        "license": PUBLIC_DOMAIN[0],
        "owner": 'Zend',
        "pros": 'established, huge ecosystem of libraries, versatility, has multiprocessor capabilities',
        "cons": 'interpreted language, scope limited to web applications',
        "limitations": 'fully synchronous language',
        "ecosystem": False,
    }
    django = {
        "featured": True,
        "name": 'Django',
        "image_url": 'https://static.djangoproject.com/img/logos/django-logo-negative.png',
        "category": categories['web_backend_framework'].pk,
        "description": "Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design.\n"
                       " Built by experienced developers, it takes care of much of the hassle of Web development,"
                       " so you can focus on writing your app without needing to reinvent the wheel. \n"
                       "It’s free and open source.",
        "url": 'https://www.djangoproject.com/',
        "license": PUBLIC_DOMAIN[0],
        "owner": 'Django Software Foundation',
        "pros": 'batteries included, powerful ORM, established, huge ecosystem of libraries',
        "cons": 'very oppinionated framework',
        "limitations": 'ORM supports only SQL databases',
        "ecosystem": False,
    }
    react = {
        "featured": True,
        "name": 'ReactJs',
        "image_url": 'https://chloerei.com/rails-frontend/images/reactjs-logo.png',
        "category": categories['frontend'].pk,
        "description": "React (also known as React.js or ReactJS) is an open-source, front end, JavaScript library"
                       " for building user interfaces or UI components. It is maintained by Facebook and a community "
                       "of individual developers and companies. React can be used as a base in the development"
                       " of single-page or mobile applications. However, React is only concerned with state management "
                       "and rendering that state to the DOM, so creating React applications usually requires the use "
                       "of additional libraries for routing, and fully-fledged form solutions. React Router"
                       " and Formik are examples of such libraries respectively.",
        "url": 'https://reactjs.org//',
        "license": PUBLIC_DOMAIN[0],
        "owner": 'Facebook',
        "pros": 'modular, unoppinionated, reusable components, virtual DOM',
        "cons": 'state sharing between components',
        "limitations": 'complex state management requires external library',
        "ecosystem": False,
    }

    TECHNOLOGIES = [javascript, python, php, django, react]
    FEATURED_TECHS = [javascript['name'], python['name'], php['name'], django['name'], react['name']]
    LINKED_TECH = [
        (django, (python,)),
        (react, (javascript,))
    ]

    for tech in TECHNOLOGIES:
        serialized = TechnologySerializer(data=tech)
        if serialized.is_valid():
            serialized.save()
    created_techs = {}
    for tech in Technology.objects.all():
        tech.author = choice(users)
        created_techs[tech.name] = tech
        if tech.name in FEATURED_TECHS:
            tech.featured = True
        tech.save()
    for tech in LINKED_TECH:
        created_techs[tech[0]['name']].ecosystem.add(*[created_techs[t['name']] for t in tech[1]])
    return categories, created_techs