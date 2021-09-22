import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'simple',
  },
  { path: 'simple', loadChildren: () => import('./usecases/simple/simple.module').then((m) => m.SimpleModule) },
  {
    path: 'dynamic-import-component',
    loadChildren: () =>
      import('./usecases/dynamic-import-component/dynamic-import-component.module').then(
        (m) => m.DynamicImportComponentModule
      ),
  },
  {
    path: 'dynamic-import-module-auto-select-component',
    loadChildren: () =>
      import(
        './usecases/dynamic-import-module-auto-select-component/dynamic-import-module-auto-select-component.module'
      ).then((m) => m.DynamicImportModuleAutoSelectComponentModule),
  },
  {
    path: 'dynamic-import-module-manual-select-component',
    loadChildren: () =>
      import(
        './usecases/dynamic-import-module-manual-select-component/dynamic-import-module-manual-select-component.module'
      ).then((m) => m.DynamicImportModuleManualSelectComponentModule),
  },
  {
    path: 'dynamic-import-inputs',
    loadChildren: () =>
      import('./usecases/dynamic-import-inputs/dynamic-import-inputs.module').then((m) => m.DynamicImportInputsModule),
  },
  {
    path: 'dynamic-import-outputs',
    loadChildren: () =>
      import('./usecases/dynamic-import-outputs/dynamic-import-outputs.module').then(
        (m) => m.DynamicImportOutputsModule
      ),
  },
  {
    path: 'dynamic-import-to-many-loader-in-one-component',
    loadChildren: () =>
      import(
        './usecases/dynamic-import-to-many-loader-in-one-component/dynamic-import-to-many-loader-in-one-component.module'
      ).then((m) => m.DynamicImportToManyLoaderInOneComponentModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
