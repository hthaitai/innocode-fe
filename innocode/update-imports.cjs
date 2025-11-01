const fs = require('fs');
const path = require('path');

// Mapping của các path cũ sang path mới
const importMappings = [
  // Auth
  { from: /from ['"]\.\.\/components\/authenticate\//g, to: "from '../features/auth/components/" },
  { from: /from ['"]\.\.\/\.\.\/components\/authenticate\//g, to: "from '../../features/auth/components/" },
  { from: /from ['"]@\/components\/authenticate\//g, to: "from '@/features/auth/components/" },
  { from: /from ['"]\.\.\/services\/auth\//g, to: "from '../features/auth/services/" },
  { from: /from ['"]\.\.\/\.\.\/services\/auth\//g, to: "from '../../features/auth/services/" },
  { from: /from ['"]@\/services\/auth\//g, to: "from '@/features/auth/services/" },
  
  // Shared components
  { from: /from ['"]\.\.\/components\/BaseModal['"]/g, to: "from '../shared/components/BaseModal'" },
  { from: /from ['"]\.\.\/\.\.\/components\/BaseModal['"]/g, to: "from '../../shared/components/BaseModal'" },
  { from: /from ['"]@\/components\/BaseModal['"]/g, to: "from '@/shared/components/BaseModal'" },
  { from: /from ['"]\.\.\/components\/DropdownFluent['"]/g, to: "from '../shared/components/DropdownFluent'" },
  { from: /from ['"]\.\.\/\.\.\/components\/DropdownFluent['"]/g, to: "from '../../shared/components/DropdownFluent'" },
  { from: /from ['"]@\/components\/DropdownFluent['"]/g, to: "from '@/shared/components/DropdownFluent'" },
  { from: /from ['"]\.\.\/components\/TableFluent['"]/g, to: "from '../shared/components/TableFluent'" },
  { from: /from ['"]\.\.\/\.\.\/components\/TableFluent['"]/g, to: "from '../../shared/components/TableFluent'" },
  { from: /from ['"]@\/components\/TableFluent['"]/g, to: "from '@/shared/components/TableFluent'" },
  { from: /from ['"]\.\.\/components\/TabNavigation['"]/g, to: "from '../shared/components/TabNavigation'" },
  { from: /from ['"]\.\.\/\.\.\/components\/TabNavigation['"]/g, to: "from '../../shared/components/TabNavigation'" },
  { from: /from ['"]@\/components\/TabNavigation['"]/g, to: "from '@/shared/components/TabNavigation'" },
  { from: /from ['"]\.\.\/components\/ToggleSwitchFluent['"]/g, to: "from '../shared/components/ToggleSwitchFluent'" },
  { from: /from ['"]\.\.\/\.\.\/components\/ToggleSwitchFluent['"]/g, to: "from '../../shared/components/ToggleSwitchFluent'" },
  { from: /from ['"]@\/components\/ToggleSwitchFluent['"]/g, to: "from '@/shared/components/ToggleSwitchFluent'" },
  { from: /from ['"]\.\.\/components\/PageContainer['"]/g, to: "from '../shared/components/PageContainer'" },
  { from: /from ['"]\.\.\/\.\.\/components\/PageContainer['"]/g, to: "from '../../shared/components/PageContainer'" },
  { from: /from ['"]@\/components\/PageContainer['"]/g, to: "from '@/shared/components/PageContainer'" },
  { from: /from ['"]\.\.\/components\/breadcrumb/g, to: "from '../shared/components/breadcrumb" },
  { from: /from ['"]\.\.\/\.\.\/components\/breadcrumb/g, to: "from '../../shared/components/breadcrumb" },
  { from: /from ['"]@\/components\/breadcrumb/g, to: "from '@/shared/components/breadcrumb" },
  { from: /from ['"]\.\.\/components\/layout/g, to: "from '../shared/components/layout" },
  { from: /from ['"]\.\.\/\.\.\/components\/layout/g, to: "from '../../shared/components/layout" },
  { from: /from ['"]@\/components\/layout/g, to: "from '@/shared/components/layout" },
  { from: /from ['"]\.\.\/components\/navbar/g, to: "from '../shared/components/navbar" },
  { from: /from ['"]\.\.\/\.\.\/components\/navbar/g, to: "from '../../shared/components/navbar" },
  { from: /from ['"]@\/components\/navbar/g, to: "from '@/shared/components/navbar" },
  { from: /from ['"]\.\.\/components\/sidebar/g, to: "from '../shared/components/sidebar" },
  { from: /from ['"]\.\.\/\.\.\/components\/sidebar/g, to: "from '../../shared/components/sidebar" },
  { from: /from ['"]@\/components\/sidebar/g, to: "from '@/shared/components/sidebar" },
  { from: /from ['"]\.\.\/components\/search/g, to: "from '../shared/components/search" },
  { from: /from ['"]\.\.\/\.\.\/components\/search/g, to: "from '../../shared/components/search" },
  { from: /from ['"]@\/components\/search/g, to: "from '@/shared/components/search" },
  { from: /from ['"]\.\.\/components\/quiz/g, to: "from '../shared/components/quiz" },
  { from: /from ['"]\.\.\/\.\.\/components\/quiz/g, to: "from '../../shared/components/quiz" },
  { from: /from ['"]@\/components\/quiz/g, to: "from '@/shared/components/quiz" },
  { from: /from ['"]\.\.\/components\/countdowntimer/g, to: "from '../shared/components/countdowntimer" },
  { from: /from ['"]\.\.\/\.\.\/components\/countdowntimer/g, to: "from '../../shared/components/countdowntimer" },
  { from: /from ['"]@\/components\/countdowntimer/g, to: "from '@/shared/components/countdowntimer" },
  { from: /from ['"]\.\.\/components\/contest/g, to: "from '../shared/components/contest" },
  { from: /from ['"]\.\.\/\.\.\/components\/contest/g, to: "from '../../shared/components/contest" },
  { from: /from ['"]@\/components\/contest/g, to: "from '@/shared/components/contest" },
  
  // Utils & Validators
  { from: /from ['"]\.\.\/utils\//g, to: "from '../shared/utils/" },
  { from: /from ['"]\.\.\/\.\.\/utils\//g, to: "from '../../shared/utils/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/utils\//g, to: "from '../../../shared/utils/" },
  { from: /from ['"]@\/utils\//g, to: "from '@/shared/utils/" },
  { from: /from ['"]\.\.\/validators\//g, to: "from '../shared/validators/" },
  { from: /from ['"]\.\.\/\.\.\/validators\//g, to: "from '../../shared/validators/" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/validators\//g, to: "from '../../../shared/validators/" },
  { from: /from ['"]@\/validators\//g, to: "from '@/shared/validators/" },
  
  // Hooks
  { from: /from ['"]\.\.\/hooks\/common/g, to: "from '../shared/hooks/common" },
  { from: /from ['"]\.\.\/\.\.\/hooks\/common/g, to: "from '../../shared/hooks/common" },
  { from: /from ['"]@\/hooks\/common/g, to: "from '@/shared/hooks/common" },
  { from: /from ['"]\.\.\/hooks\/useUsers['"]/g, to: "from '../shared/hooks/useUsers'" },
  { from: /from ['"]\.\.\/\.\.\/hooks\/useUsers['"]/g, to: "from '../../shared/hooks/useUsers'" },
  { from: /from ['"]@\/hooks\/useUsers['"]/g, to: "from '@/shared/hooks/useUsers'" },
  
  // Pages - Common
  { from: /from ['"]\.\.\/pages\/common\//g, to: "from '../features/common/pages/" },
  { from: /from ['"]\.\.\/\.\.\/pages\/common\//g, to: "from '../../features/common/pages/" },
  { from: /from ['"]@\/pages\/common\//g, to: "from '@/features/common/pages/" },
  
  // Pages - Student
  { from: /from ['"]\.\.\/pages\/student\//g, to: "from '../features/student/pages/" },
  { from: /from ['"]\.\.\/\.\.\/pages\/student\//g, to: "from '../../features/student/pages/" },
  { from: /from ['"]@\/pages\/student\//g, to: "from '@/features/student/pages/" },
  
  // Contest services
  { from: /from ['"]\.\.\/services\/contests\/contestService['"]/g, to: "from '../features/contest/services/contestService'" },
  { from: /from ['"]\.\.\/\.\.\/services\/contests\/contestService['"]/g, to: "from '../../features/contest/services/contestService'" },
  { from: /from ['"]@\/services\/contests\/contestService['"]/g, to: "from '@/features/contest/services/contestService'" },
  
  // Organizer services
  { from: /from ['"]\.\.\/services\/provinceService['"]/g, to: "from '../features/organizer/services/provinceService'" },
  { from: /from ['"]\.\.\/\.\.\/services\/provinceService['"]/g, to: "from '../../features/organizer/services/provinceService'" },
  { from: /from ['"]@\/services\/provinceService['"]/g, to: "from '@/features/organizer/services/provinceService'" },
  { from: /from ['"]\.\.\/services\/schoolService['"]/g, to: "from '../features/organizer/services/schoolService'" },
  { from: /from ['"]\.\.\/\.\.\/services\/schoolService['"]/g, to: "from '../../features/organizer/services/schoolService'" },
  { from: /from ['"]@\/services\/schoolService['"]/g, to: "from '@/features/organizer/services/schoolService'" },
];

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  importMappings.forEach(mapping => {
    if (mapping.from.test(content)) {
      content = content.replace(mapping.from, mapping.to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, dist, build
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      updateImportsInFile(filePath);
    }
  });
}

// Start từ src directory
const srcDir = path.join(__dirname, 'src');
console.log('Starting import path updates...');
processDirectory(srcDir);
console.log('Import path updates completed!');
